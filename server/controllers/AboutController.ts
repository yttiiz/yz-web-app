import { DefaultController } from "./DefaultController.ts";
import { RouterAppType, RouterContextAppType } from "@controllers";

export class AboutController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
    this.getAbout();
  }

  private getAbout() {
    this.router?.get("/about", async <T extends string>(ctx: RouterContextAppType<T>) => {
      this.response(ctx, "Okay", 200);
    })
  }
}