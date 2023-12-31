import { oak, ObjectId } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";
import type { 
  BookingUserInfoType,
  FindCursorBookingsProductType,
  FindCursorProductType,
  FindCursorReviewProductType,
} from "@mongo";

export class BookingController extends DefaultController {
  private getCollection;

  constructor(
    router: RouterAppType,
    getCollection: GetCollectionType,
  ) {
    super(router);
    this.getCollection = getCollection;
    this.getBooking();
  }

  private getBooking() {
    this.router?.get(
      "/booking",
      async (ctx: RouterContextAppType<"/booking">) => {
        if (ctx.state.session) {
          const data: BookingUserInfoType[] = [];
          const userId: ObjectId = ctx.state.session.get("userId");
          
          const bookingsCursor = await this.getCollection("bookings");
          const productsCursor = await this.getCollection("products");
          const reviewsCursor = await this.getCollection("reviews");

          try {
            if (
              ("message" in bookingsCursor && bookingsCursor["message"].includes("failed")) ||
              ("message" in productsCursor && productsCursor["message"].includes("failed")) ||
              ("message" in reviewsCursor && reviewsCursor["message"].includes("failed"))
            ) {
              this.response(
                ctx,
                JSON.stringify({
                  errorMsg: this.errorMsg,
                }),
                502,
              );

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
                        startingDate: booking.startingDate,
                        endingDate: booking.endingDate,
                        details,
                        thumbnail,
                        rates,
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
          this.response(ctx, { errorMsg: this.errorMsg }, 302, "/");
        }
      }
    )
  }
}