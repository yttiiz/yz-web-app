import { oak, ObjectId } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type {
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";

export class BookingController extends DefaultController {
  constructor(
    router: RouterAppType,
  ) {
    super(router);
    this.getBooking();
  }

  private getBooking() {
    this.router?.get(
      "/booking",
      async (ctx: RouterContextAppType<"/booking">) => {
        const body = await this.createHtmlFile(
          ctx,
          {
            id: "data-booking",
            css: "booking",
            title: "gérer vos réservations",
          }
        );
        
        this.response(ctx, body, 200);
      }
    )
  }

}