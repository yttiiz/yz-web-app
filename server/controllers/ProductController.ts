import { ObjectId } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import {
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
  }

  getProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.get(
      productRoute,
      async (ctx: RouterContextAppType<typeof productRoute>) => {
        const _id = new ObjectId(ctx.params.id);
        const data = await this.selectFromDB("products", _id);
        
        if ("_id" in data) {
          const body = await this.createHtmlFile(ctx,
            {
              id: "data-product",
              data,
              title: "Aka " + data.name,
            },
          );
          this.response(ctx, body, 200);

        } else {
          const body = await this.createHtmlFile(
            ctx,
            {
              id: "data-not-found",
              title: data.message,
            },
          );

          this.response(ctx, body, 404);
        }
      },
    )
  }
} 