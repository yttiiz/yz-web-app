import { ObjectId } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type {
  GetCollectionType,
  RouterAppType,
  RemoveItemFromDBType,
  RouterContextAppType,
  SessionType,
} from "./mod.ts";
import { 
  type BookingsType,
  type BookingUserInfoType,
  type FindCursorBookingsProductType,
  type FindCursorProductType,
  type FindCursorReviewProductType,
} from "@mongo";

export class BookingController extends DefaultController {
  private getCollection;
  private removeItemFromDB;

  constructor(
    router: RouterAppType,
    getCollection: GetCollectionType,
    removeItemFromDB: RemoveItemFromDBType<BookingsType>,
  ) {
    super(router);
    this.getCollection = getCollection;
    this.removeItemFromDB = removeItemFromDB
    this.getBooking();
    this.deleteBooking();
  }

  private getBooking() {
    this.router?.get(
      "/booking",
      async (ctx: RouterContextAppType<"/booking">) => {
        if (ctx.state.session && ctx.state.session.has("userId")) {
          const data: BookingUserInfoType[] = [];
          const userId = (ctx.state.session as SessionType).get("userId");
          
          const bookingsCursor = await this.getCollection("bookings");
          const productsCursor = await this.getCollection("products");
          const reviewsCursor = await this.getCollection("reviews");

          try {
            if (
              ("message" in bookingsCursor && bookingsCursor["message"].includes("failed")) ||
              ("message" in productsCursor && productsCursor["message"].includes("failed")) ||
              ("message" in reviewsCursor && reviewsCursor["message"].includes("failed"))
            ) {
              this.response(ctx, "", 302, "/");

            } else {
              const products = await (productsCursor as FindCursorProductType).toArray();
              const reviews = await (reviewsCursor as FindCursorReviewProductType).toArray();
              
              // Get bookings related to user.
              for await (const document of (bookingsCursor as FindCursorBookingsProductType)) {
                for (const booking of document.bookings) {

                  if (booking.userId === userId.toString()) {

                    // Get product details related to current booking.
                    const details = products.find(product => (
                      document.productId === product._id.toString()
                      ))?.details;

                    // Get product thumbnail related to current booking.
                    const thumbnail = products.find(product => (
                      document.productId === product._id.toString()
                      ))?.thumbnail;
                      
                    // Get product rates related to current booking.
                    const rates = reviews.find(review => (
                      document.productId === review.productId
                    ))?.reviews.reduce((acc, review) => {
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

              data.sort((a, b) => (
                new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime()
              ));

              const body = await this.createHtmlFile(
                ctx,
                {
                  id: "data-booking",
                  css: "booking",
                  title: "gérer vos réservations",
                  data,
                },
              );
      
              this.response(ctx, body, 200);
            }
            
          } catch (error) {
            this.helper.writeLog(error);
          }

        } else {
          this.response(ctx, "", 302, "/");
        }
      },
    )
  }

  deleteBooking() {
    this.router?.delete(
      "/cancel-booking",
      async (ctx: RouterContextAppType<"/cancel-booking">) => {
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

        const isBookingDelete = await this.removeItemFromDB(
          _id,
          bookingToDelete,
          "bookings",
        );

        this.response(
          ctx,
          {
            message: `Votre réservation ${
              isBookingDelete
                ? "a bien été"
                : "n'a pas pu être"
            } annulée`,
          },
          200,
        );
      },
    );
  }
}