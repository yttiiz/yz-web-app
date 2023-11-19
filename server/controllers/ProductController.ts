import { oak, ObjectId } from "@deps";
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
        const { id } = oak.helpers.getQuery(ctx, { mergeParams: true });
        const _id = new ObjectId(id);

        const product = await this.selectFromDB("products", _id);
        const body = await this.createHtmlFile(ctx,
          {
            id: "data-product",
          }
        );
        this.response(ctx, body, 200);
      },
    )
  }
} 