import { Helper } from "@utils";
import { DefaultController } from "./DefaultController.ts";
import { RouterAppType, RouterContextAppType } from "@controllers";

export class AboutController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
    this.getAbout();
  }

  private getAbout() {
    this.router?.get(
      "/about",
      async <T extends string>(ctx: RouterContextAppType<T>) => {
        const body = await this.createHtmlFile(ctx, {
          id: "data-about",
          css: "about",
        });

        this.response(ctx, body, 200);
      },
    );
  }
}
