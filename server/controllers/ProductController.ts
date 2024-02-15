import { Document, ObjectId } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import { RouterAppType, RouterContextAppType } from "./mod.ts";
import {
  BookingsProductSchemaWithIDType,
  NotFoundMessageType,
  ProductSchemaWithIDType,
  ReviewsProductSchemaWithIDType,
} from "@mongo";
import { Handler, Mailer, Validator } from "@utils";
import { ProductDataType } from "@/server/components/types.ts";

export class ProductController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
    this.getProduct();
    this.postBooking();
    this.postReview();
  }

  private getProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.get(
      productRoute,
      async (ctx: RouterContextAppType<typeof productRoute>) => {
        try {
          const _id = new ObjectId(ctx.params.id);
          const getFromDB = async <T extends Document>(db: string) =>
            await this.mongo.selectFromDB<T>(
              db,
              ctx.params.id,
              "productId",
            );

          const product = await this.mongo.selectFromDB<
            ProductSchemaWithIDType
          >("products", _id);
          const reviews = await getFromDB<ReviewsProductSchemaWithIDType>(
            "reviews",
          );
          const bookings = await getFromDB<BookingsProductSchemaWithIDType>(
            "bookings",
          );

          if ("_id" in product && "_id" in reviews && "_id" in bookings) {
            const actualOrFutureBookings = Handler
              .getProductPresentOrNextBookings(
                bookings.bookings,
              );

            const body = await this.createHtmlFile(ctx, {
              id: "data-product",
              css: "product",
              data: {
                product,
                reviews,
                actualOrFutureBookings,
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
        } catch (_) {
          const body = await this.createHtmlFile(
            ctx,
            {
              id: "data-not-found",
              css: "not-found",
              title: "page inexistante",
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
        const formData = await ctx.request.body.formData();
        const { booking } = await this.helper.convertJsonToObject(
          `/server/data/product/product.json`,
        ) as ProductDataType;

        const dataParsed = Validator.dataParser(
          formData,
          booking,
        );

        if (!dataParsed.isOk) {
          return this.response(
            ctx,
            { message: dataParsed.message },
            401,
          );
        }

        const {
          "starting-date": startingDate,
          "ending-date": endingDate,
          id,
        } = dataParsed.data as Record<string, string>;

        const { userId, userName } = await this.getUserInfo(ctx);

        const newBooking = {
          userId,
          userName,
          startingDate,
          endingDate,
          createdAt: Date.now(),
        };

        const product = await this.getProductFromDB<ProductSchemaWithIDType>(
          id,
        );
        const bookings = await this.mongo.selectFromDB<
          BookingsProductSchemaWithIDType
        >(
          "bookings",
          id,
          "productId",
        );

        if ("_id" in product && "_id" in bookings) {
          const bookingsAvailability = Handler.compareBookings(
            newBooking,
            bookings,
          );

          if (bookingsAvailability.isAvailable) {
            const { bookingId } = product;
            const _bookingId = new ObjectId(bookingId);

            const isInsertionOk = await this.mongo.addNewItemIntoDB(
              _bookingId,
              newBooking,
              "bookings",
              "bookings",
            );

            if (isInsertionOk) {
              try {
                await Mailer.send({
                  to: ctx.state.session.get("userEmail"),
                  receiver: ctx.state.session.get("userFullname"),
                });
              } catch (error) {
                this.helper.writeLog(error);
              }
            }

            isInsertionOk
              ? this.response(
                ctx,
                {
                  title: "Réservation confirmée",
                  email: ctx.state.session.get("userEmail"),
                  message:
                    "Votre réservation du {{ start }} au {{ end }} a bien été enregistrée. Un e-mail de confirmation a été envoyé à l'adresse {{ email }}.",
                  booking: {
                    start: this.helper.displayDate({
                      date: new Date(newBooking.startingDate),
                      style: "short",
                    }),
                    end: this.helper.displayDate({
                      date: new Date(newBooking.endingDate),
                      style: "short",
                    }),
                  },
                },
                200,
              )
              : this.response(ctx, "", 503);
          } else {
            const { booking } = bookingsAvailability;

            this.response(
              ctx,
              {
                title: "Créneau indisponible",
                message:
                  "Le logement est occupé du {{ start }} au {{ end }}. Choisissez un autre créneau.",
                booking: {
                  start: this.helper.displayDate({
                    date: new Date(booking.startingDate),
                    style: "short",
                  }),
                  end: this.helper.displayDate({
                    date: new Date(booking.endingDate),
                    style: "short",
                  }),
                },
              },
              200,
            );
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
      },
    );
  }

  private postReview() {
    this.router?.post(
      "/review-form",
      async (ctx: RouterContextAppType<"/review-form">) => {
        const formData = await ctx.request.body.formData();
        const { reviewForm } = await this.helper.convertJsonToObject(
          `/server/data/product/product.json`,
        ) as ProductDataType;

        const dataParsed = Validator.dataParser(
          formData,
          reviewForm,
        );

        if (!dataParsed.isOk) {
          return this.response(
            ctx,
            { message: dataParsed.message },
            401,
          );
        }

        const {
          id,
          review,
          rate,
          className,
        } = dataParsed.data as Record<string, string>;

        const { userId, userName } = await this.getUserInfo(ctx);

        const newReview = {
          userId,
          userName,
          rate: +rate,
          comment: review,
          timestamp: Date.now(),
        };

        const product = await this.getProductFromDB<ProductSchemaWithIDType>(
          id,
        );

        if ("_id" in product) {
          const { reviewId } = product;
          const _reviewId = new ObjectId(reviewId);
          const isInsertionOk = await this.mongo.addNewItemIntoDB(
            _reviewId,
            newReview,
            "reviews",
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
    };
  }

  private async getProductFromDB<T extends Document>(id: string) {
    const _id = new ObjectId(id);
    return await this.mongo.selectFromDB<T>("products", _id);
  }
}
