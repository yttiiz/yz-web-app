import { DefaultController, RouterContextAppType, SessionType } from "@controllers";
import {
  BookingsProductSchemaWithIDType,
  BookingsType,
  BookingUserInfoType,
  FindCursorBookingsProductType,
  FindCursorProductType,
  FindCursorReviewProductType,
  Mongo,
  ProductSchemaWithIDType,
  ReviewsProductSchemaWithIDType,
} from "@mongo";
import { Validator } from "@utils";
import { FormDataType } from "@components";
import { ObjectId } from "@deps";

export class BookingService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public getBooking = async (ctx: RouterContextAppType<"/booking">) => {
    if (ctx.state.session && ctx.state.session.has("userId")) {
      const data: BookingUserInfoType[] = [];
      const userId = (ctx.state.session as SessionType).get("userId");

      try {
        const bookingsCursor = await Mongo.connectionTo<
          BookingsProductSchemaWithIDType
        >("bookings");
        const productsCursor = await Mongo.connectionTo<
          ProductSchemaWithIDType
        >("products");
        const reviewsCursor = await Mongo.connectionTo<
          ReviewsProductSchemaWithIDType
        >("reviews");

        if (
          ("message" in bookingsCursor &&
            bookingsCursor["message"].includes("failed")) ||
          ("message" in productsCursor &&
            productsCursor["message"].includes("failed")) ||
          ("message" in reviewsCursor &&
            reviewsCursor["message"].includes("failed"))
        ) {
          this.default.response(ctx, "", 302, "/");
        } else {
          const products = await (
            productsCursor as FindCursorProductType
          ).toArray();
          const reviews = await (
            reviewsCursor as FindCursorReviewProductType
          ).toArray();

          // Get bookings related to user.
          for await (
            const document of bookingsCursor as FindCursorBookingsProductType
          ) {
            for (const booking of document.bookings) {
              if (booking.userId === userId.toString()) {
                // Get product details related to current booking.
                const details = products.find(
                  (product) => document.productId === product._id.toString(),
                )?.details;

                // Get product thumbnail related to current booking.
                const thumbnail = products.find(
                  (product) => document.productId === product._id.toString(),
                )?.thumbnail;

                // Get product rates related to current booking.
                const rates = reviews
                  .find((review) => document.productId === review.productId)
                  ?.reviews.reduce((acc, review) => {
                    acc.push(review.rate);
                    return acc;
                  }, [] as number[]);

                if (details && thumbnail && rates) {
                  data.push({
                    productId: document.productId,
                    productName: document.productName,
                    bookingId: document._id.toString(),
                    startingDate: booking.startingDate,
                    endingDate: booking.endingDate,
                    details,
                    thumbnail,
                    rates,
                    createdAt: booking.createdAt,
                  });
                }
              }
            }
          }

          data.sort(
            (a, b) =>
              new Date(a.startingDate).getTime() -
              new Date(b.startingDate).getTime(),
          );

          const body = await this.default.createHtmlFile(ctx, {
            id: "data-booking",
            css: "booking",
            title: "gérer vos réservations",
            data,
          });

          this.default.response(ctx, body, 200);
        }
      } catch (error) {
        this.default.helper.writeLog(error);
      }
    } else {
      this.default.response(ctx, "", 302, "/");
    }
  };

  public putHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const formData = await ctx.request.body.formData();
      const dataModel = (await this.default.helper.convertJsonToObject(
        "/server/data/admin/booking-form.json",
      )) as FormDataType;

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
          ctx,
          {
            title: "Modification non effectuée",
            message: dataParsed.message,
          },
          401,
        );
      }

      const data = dataParsed.data as unknown as BookingsType;

      // Even 'createdAt' is typed as number, it's a string.
      const itemValue = +data.createdAt;
      data.createdAt = itemValue;

      const isUpdate = await this.default.mongo.updateItemIntoDB({
        data,
        collection: "bookings",
        key: "bookings",
        itemKey: "createdAt",
        itemValue,
      });

      return this.default.response(
        ctx,
        {
          title: "Modification réservation",
          message: this.default.helper
            .msgToAdmin`La réservation de ${data.userName} ${isUpdate} été${"update"}`,
        },
        200,
      );
    } catch (error) {
      this.default.helper.writeLog(error);
    }
  };

  public deleteBooking = async (
    ctx: RouterContextAppType<"/cancel-booking">,
  ) => {
    const data = await ctx.request.body.formData();
    const fields: Record<string, FormDataEntryValue> = {};

    for (const [key, value] of data) {
      fields[key] = value;
    }

    const {
      bookingId,
      bookingStart,
      bookingEnd,
      bookingCreatedAt,
    } = fields as Record<string, string>;

    const _id = new ObjectId(bookingId);
    const bookingToDelete = {
      userId: ((ctx.state.session as SessionType).get("userId")).toString(),
      userName: (ctx.state.session as SessionType).get("userFullname"),
      startingDate: bookingStart,
      endingDate: bookingEnd,
      createdAt: +bookingCreatedAt,
    };

    const isBookingDelete = await Mongo.removeItemFromDB(
      _id,
      bookingToDelete,
      "bookings",
      "bookings",
    );

    this.default.response(
      ctx,
      {
        message: `Votre réservation ${
          isBookingDelete ? "a bien été" : "n'a pas pu être"
        } annulée`,
      },
      200,
    );
  };
}
