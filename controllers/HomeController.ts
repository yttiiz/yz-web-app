import { DefaultController } from "./DefaultController.ts";
import { RouterAppType, RouterContextAppType } from "./mod.ts";

export class HomeController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
    this.#index();
  }

  #index() {
    this.router.get("/", (ctx: RouterContextAppType<"/">) => {
      const body = this.createHtmlFile("data-users");
      this.response(ctx, body);
    });
  }
}
