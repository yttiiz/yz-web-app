import { oak, ObjectId } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import {
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";

export class ProductController extends DefaultController {
  constructor(
    router: RouterAppType,
  ) {
    super(router);
    this.getProduct();
  }

  getProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"
    
    this.router?.get(
      productRoute,
      async (ctx: RouterContextAppType<typeof productRoute>) => {
        const { id } = oak.helpers.getQuery(ctx, { mergeParams: true });
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