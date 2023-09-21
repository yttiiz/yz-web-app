import { DefaultController } from "./DefaultController.ts";
import { RouterAppType, RouterContextAppType } from "./mod.ts";

export class HomeController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
    this.#index();
  }

  #index() {
    this.router.get("/", async (ctx: RouterContextAppType<"/">) => {
      const body = await this.createHtmlFile("data-users");
      this.response(ctx, body);
    });
  }
}
