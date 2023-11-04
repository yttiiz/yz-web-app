import { DefaultController } from "./DefaultController.ts";
import type { RouterAppType, RouterContextAppType } from "./mod.ts";

export class HomeController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
    this.index();
  }

  private index() {
    this.router?.get("/", async (ctx: RouterContextAppType<"/">) => {
      const body = await this.createHtmlFile(ctx, "data-users");
      this.response(ctx, body, 200);
    });
  }
}
