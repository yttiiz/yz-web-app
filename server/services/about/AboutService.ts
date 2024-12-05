import { DefaultController, RouterContextAppType } from "@controllers";
import { Helper, Validator } from "@utils";
import { FormDataType } from "@components";

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

  public post = async <T extends string>(ctx: RouterContextAppType<T>) => {
    try {
      const formData = await ctx.request.body.formData();
      const dataModel = await Helper.convertJsonToObject<FormDataType>(
        "/server/data/about/about.json",
      );

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
          ctx,
          {
            title: "Message non envoyé",
            message: dataParsed.message,
          },
          401,
        );
      }

      //TODO Data to be treated

      this.default.response(
        ctx,
        {
          title: "Message envoyé",
          message:
            "Nous avons bien reçu votre message. Nous revenons vers vous sous peu.",
        },
        200,
      );
    } catch (error) {
      Helper.writeLog(error);
    }
  };
}
