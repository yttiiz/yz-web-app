import { ObjectId, oak } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import {
  NotFoundMessageType,
  RouterAppType,
  RouterContextAppType,
  SelectProductFromDBType,
} from "./mod.ts";

export class ProductController extends DefaultController {
  private selectFromDB;

  constructor(
    router: RouterAppType,
    selectFromDB: SelectProductFromDBType,
  ) {
    super(router);
    this.selectFromDB = selectFromDB;
    this.getProduct();
    this.postReview();
  }

  getProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.get(
      productRoute,
      async (ctx: RouterContextAppType<typeof productRoute>) => {
        const _id = new ObjectId(ctx.params.id);
        const product = await this.selectFromDB("products", _id);
        const reviews = await this.selectFromDB(
          "reviews",
          ctx.params.id,
          "productId",
        );

        if ("_id" in product && "_id" in reviews) {
          const body = await this.createHtmlFile(ctx, {
            id: "data-product",
            css: "product",
            data: {
              product,
              reviews,
            },
            title: "Aka " + product.name,
          });
          this.response(ctx, body, 200);
        } else {
          const body = await this.createHtmlFile(
            ctx,
            {
              id: "data-not-found",
              css: "not-found",
              title: (product as NotFoundMessageType).message,
            },
          );

          this.response(ctx, body, 404);
        }
      },
    );
  }

  postReview() {
    this.router?.post(
      "/review-form",
      async (ctx: RouterContextAppType<"/review-form">) => {
        const data = await ctx.request.body().value as oak.FormDataReader;
        const { fields } = await data.read({ maxSize: 10_000_000 });

        this.response(ctx, { message: "Ok" }, 200);
      }
    );
  }
}
