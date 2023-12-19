import { oak, ObjectId } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import {
  NotFoundMessageType,
  RouterAppType,
  RouterContextAppType,
  SelectProductFromDBType,
} from "./mod.ts";
import { AddNewItemIntoDBType } from "@/server/controllers/types.ts";
import { BookingsType, ReviewsType } from "@mongo";

export class ProductController extends DefaultController {
  private addNewItemIntoDB;
  private selectFromDB;

  constructor(
    router: RouterAppType,
    addNewItemIntoDB: AddNewItemIntoDBType<BookingsType | ReviewsType>,
    selectFromDB: SelectProductFromDBType,
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
        const product = await this.selectFromDB("products", _id);
        const reviews = await this.selectFromDB(
          "reviews",
          ctx.params.id,
          "productId",
        );

        if ("_id" in product && "_id" in reviews) {
          const body = await this.createHtmlFile(ctx, {
            id: "data-product",
            css: "product",
            data: {
              product,
              reviews,
            },
            title: "Aka " + product.name,
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
        
        if ("_id" in product) {
          const { bookingId } = product;
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
          const { reviewId } = product;
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
