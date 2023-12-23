import { oak, ObjectId } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import {
  NotFoundMessageType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";
import { AddNewItemIntoDBType, SelectFromDBType } from "@/server/controllers/types.ts";
import {
  BookingsProductSchemaWithIDType,
  BookingsType,
  ProductSchemaWithIDType,
  ReviewsProductSchemaWithIDType,
  ReviewsType
} from "@mongo";
import { Handler } from "@utils";

export class ProductController extends DefaultController {
  private addNewItemIntoDB;
  private selectFromDB;

  constructor(
    router: RouterAppType,
    addNewItemIntoDB: AddNewItemIntoDBType<BookingsType | ReviewsType>,
    selectFromDB: SelectFromDBType<
      | ProductSchemaWithIDType
      | BookingsProductSchemaWithIDType
      | ReviewsProductSchemaWithIDType
      | NotFoundMessageType
    >,
  ) {
    super(router);
    this.addNewItemIntoDB = addNewItemIntoDB;
    this.selectFromDB = selectFromDB;
    this.getProduct();
    this.postBooking();
    this.postReview();
  }

  private getProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.get(
      productRoute,
      async (ctx: RouterContextAppType<typeof productRoute>) => {
        const _id = new ObjectId(ctx.params.id);
        const getFromDB = async (db: string) => await this.selectFromDB(
          db,
          ctx.params.id,
          "productId",
        );

        const product = await this.selectFromDB("products", _id);
        const reviews = await getFromDB("reviews");
        const bookings = await getFromDB("bookings");

        if ("_id" in product && "_id" in reviews && "_id" in bookings) {
          const actualOrFutureBookings = Handler.getProductPresentOrNextBookings(
            (bookings as BookingsProductSchemaWithIDType).bookings,
          );

          const body = await this.createHtmlFile(ctx, {
            id: "data-product",
            css: "product",
            data: {
              product,
              reviews,
              actualOrFutureBookings,
            },
            title: "Aka " + (product as ProductSchemaWithIDType).name,
          });
          this.response(ctx, body, 200);
        } else {
          const body = await this.createHtmlFile(
            ctx,
            {
              id: "data-not-found",
              css: "not-found",
              title: (product as NotFoundMessageType).message,
            },
          );

          this.response(ctx, body, 404);
        }
      },
    );
  }

  private postBooking() {
    this.router?.post(
      "/booking",
      async (ctx: RouterContextAppType<"/booking">) => {
        const data = await ctx.request.body().value as oak.FormDataReader;
        const {
          fields: {
            "starting-date": startingDate,
            "ending-date": endingDate,
            id,
            className,
          },
        } = await data.read({ maxSize: this.MAX_SIZE});

        const { userId, userName } = await this.getUserInfo(ctx);

        const newBooking = {
          userId,
          userName,
          startingDate,
          endingDate,
        };

        const product = await this.getProductFromDB(id);
        const bookings = await this.selectFromDB(
          "bookings",
          id,
          "productId",
        );

        if ("_id" in product && "_id" in bookings) {

          const bookingsAvailability = Handler.compareBookings(
            newBooking,
            bookings as BookingsProductSchemaWithIDType,
          );

          if (bookingsAvailability.isAvailable) {
            const { bookingId } = product as ProductSchemaWithIDType;
            const _bookingId = new ObjectId(bookingId);
  
            const isInsertionOk = await this.addNewItemIntoDB(
              _bookingId,
              newBooking,
              "bookings",
            );
  
            isInsertionOk
             ? this.response(
                ctx,
                {
                  message: "lorem ipsum ",
                  className,
                },
                200,
              )
            : this.response(
              ctx,
              {
                message: "mince",
                className,
              },
              503,
            );
          } else {
            const { booking } = bookingsAvailability;
            this.response(
              ctx,
              {
                message: "Logement non disponible.",
                booking: {
                  start: booking.startingDate,
                  end: booking.endingDate, 
                },
                className,
              },
              200,
            )
          }
        } else {
          this.response(
            ctx,
            {
              message:
                "Le produit pour lequel vous souhaitez laisser un avis, est momentanément inaccessible.",
            },
            503,
          );
        }
      }
    );
  }

  private postReview() {
    this.router?.post(
      "/review-form",
      async (ctx: RouterContextAppType<"/review-form">) => {
        const data = await ctx.request.body().value as oak.FormDataReader;
        const {
          fields: {
            id,
            review,
            rate,
            className,
          },
        } = await data.read({ maxSize: this.MAX_SIZE });

        const { userId, userName } = await this.getUserInfo(ctx);

        const newReview = {
          userId,
          userName,
          rate: +rate,
          comment: review,
          timestamp: Date.now(),
        };

        const product = await this.getProductFromDB(id);

        if ("_id" in product) {
          const { reviewId } = product as ProductSchemaWithIDType;
          const _reviewId = new ObjectId(reviewId);
          const isInsertionOk = await this.addNewItemIntoDB(
            _reviewId,
            newReview,
            "reviews",
          );

          isInsertionOk
            ? this.response(
              ctx,
              {
                message: "Votre avis a bien été ajouté.",
                className,
              },
              200,
            )
            : this.response(
              ctx,
              {
                message: "La base de données n'est pas accessible.",
                className,
              },
              503,
            );
        } else {
          this.response(
            ctx,
            {
              message:
                "Le produit pour lequel vous souhaitez laisser un avis, est momentanément inaccessible.",
            },
            503,
          );
        }
      },
    );
  }

  private async getUserInfo<T extends string>(ctx: RouterContextAppType<T>) {
    return {
      userId: (await ctx.state.session.get("userId") as ObjectId).toHexString(),
      userName: await ctx.state.session.get("userFullname") as string,
    }
  }

  private async getProductFromDB(id: string) {
    const _id = new ObjectId(id);
    return await this.selectFromDB("products", _id);
  }
}
