import { Helper } from "@utils";
import { DefaultController } from "./DefaultController.ts";
import type { GetCollectionType, InsertProductsDBType, RouterAppType, RouterContextAppType, ProductsDataType } from "./mod.ts";
import { FindCursorProductType } from "@mongo";

export class HomeController extends DefaultController {
  private collection;
  private insert;

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
    insert: InsertProductsDBType,

  ) {
    super(router);
    this.collection = collection;
    this.insert = insert;
    this.helper = Helper;
    this.index();
  }

  private index() {
    this.router?.get("/", async (ctx: RouterContextAppType<"/">) => {
      // this.insert({
      //   type: "F1",
      //   name: "Aka Ange",
      //   description: "Le calme plat pour un vrai moment de détente.",
      //   thumbnail: { src: "/img/products/fixture_0002.jpg", alt: "alt-text"},
      //   pictures: [{ src: "/img/products/fixture_0002.jpg", alt: "alt-text"}],
      //   rate: {
      //     excellent: 15,
      //     good: 12,
      //     quiteGood: 25,
      //     bad: 6,
      //     execrable: 2,
      //   },
      //   review: [
      //     {
      //       id: "0002",
      //       senderId: "0879846666",
      //       review: "Accueil magnifique. Franchement, rien à dire !"
      //     }
      //   ],
      // }, "products");

      const data: ProductsDataType = {};
      const cursor = await this.collection("products");

      try {
        if (cursor) {
          await (cursor as FindCursorProductType)
            .map((document, key) => data[key + 1] = document);

          const body = await this.createHtmlFile(
            ctx, {
              id: "data-home",
              data
            }
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
