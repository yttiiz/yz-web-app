import { DefaultController } from "./DefaultController.ts";
import type {
  ProductsDataType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";
import type {
  ReviewsProductSchemaWithIDType,
  FindCursorProductType
} from "@mongo";

export class HomeController extends DefaultController {

  constructor(
    router: RouterAppType,
  ) {
    super(router);
    this.index();
  }

  private index() {
    this.router?.get(
      "/",
      async (ctx: RouterContextAppType<"/">) => {
        const data: ProductsDataType = {};
        const cursor = await this.mongo.connectionTo("products");

        try {
          if ("message" in cursor && cursor["message"].includes("failed")) {
            const body = await this.createHtmlFile(
              ctx,
              {
                id: "data-home",
                css: "home",
                data: this.errorMsg,
              },
            );

            this.response(
              ctx,
              body,
              200,
            );

          } else {
            await (cursor as FindCursorProductType)
              .map((document, key) => data[key + 1] = document);

            for await (const key of Object.keys(data)) {
              const id = data[key as unknown as keyof typeof data]._id;
              const reviews = await this.mongo.selectFromDB<ReviewsProductSchemaWithIDType>(
                "reviews",
                id.toString(),
                "productId",
              );

              if ("_id" in reviews) {
                data[key as unknown as keyof typeof data].reviews = reviews;
              }
            }

            const body = await this.createHtmlFile(
              ctx,
              {
                id: "data-home",
                css: "home",
                data,
              },
            );
            this.response(ctx, body, 200);
          }
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    );
  }
}
