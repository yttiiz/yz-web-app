import { DefaultController, RouterContextAppType } from "@controllers";

export class AboutService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public get = async <T extends string>(ctx: RouterContextAppType<T>) => {
    const body = await this.default.createHtmlFile(ctx, {
      id: "data-about",
      css: "about",
      title: "contactez-nous",
    });

    this.default.response(ctx, body, 200);
  };
}
