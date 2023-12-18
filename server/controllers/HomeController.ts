import { Helper } from "@utils";
import { DefaultController } from "./DefaultController.ts";
import type {
  GetCollectionType,
  ProductsDataType,
  RouterAppType,
  RouterContextAppType,
  SelectReviewFromDBType,
} from "./mod.ts";
import type { FindCursorProductType } from "@mongo";

export class HomeController extends DefaultController {
  private collection;
  private selectFromDB;

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
    selectFromDB: SelectReviewFromDBType,
  ) {
    super(router);
    this.collection = collection;
    this.selectFromDB = selectFromDB;
    this.helper = Helper;
    this.index();
  }

  private index() {
    this.router?.get("/", async (ctx: RouterContextAppType<"/">) => {
      const data: ProductsDataType = {};
      const cursor = await this.collection("products");

      try {
        if (cursor) {
          await (cursor as FindCursorProductType)
            .map((document, key) => data[key + 1] = document);

          for await (const key of Object.keys(data)) {
            const id = data[key as unknown as keyof typeof data]._id;
            const reviews = await this.selectFromDB(
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
        } else {
          this.response(
            ctx,
            JSON.stringify({
              errorMsg: this.errorMsg,
            }),
            502,
          );
        }
      } catch (error) {
        this.helper.writeLog(error);
      }
    });
  }
}
