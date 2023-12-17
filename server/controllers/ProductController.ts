import { ObjectId, oak } from "@deps";
import { dynamicRoutes } from "@dynamic-routes";
import { DefaultController } from "./DefaultController.ts";
import {
  NotFoundMessageType,
  RouterAppType,
  RouterContextAppType,
  SelectProductFromDBType,
  AddNewItemIntoReviewType
} from "./mod.ts";

export class ProductController extends DefaultController {
  private addNewItemIntoReview;
  private selectFromDB;

  constructor(
    router: RouterAppType,
    addNewItemIntoReview: AddNewItemIntoReviewType,
    selectFromDB: SelectProductFromDBType,
  ) {
    super(router);
    this.addNewItemIntoReview = addNewItemIntoReview;
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
        const { fields: {
          id,
          review,
          rate,
          className,
        } } = await data.read({ maxSize: 10_000_000 });

        const userId: string = (ctx.state.session.get("userId") as ObjectId)
        .toHexString();
        const userName: string = ctx.state.session.get("userFirstname");

        const newReview = {
          userId,
          userName,
          rate: +rate,
          comment: review,
          timestamp: Date.now(),
        };

        const _id = new ObjectId(id);
        const product = await this.selectFromDB("products", _id);

        if ("_id" in product) {
          const { reviewId } = product;
          const _reviewId = new ObjectId(reviewId);
          const isInsertionOk = await this.addNewItemIntoReview(
            _reviewId,
            newReview,
            "reviews"
          );

          isInsertionOk
            ? this.response(
                ctx,
                {
                  message: "Votre avis a bien été ajouté.",
                  className,
                },
                200,
              )
            : this.response(
                ctx,
                {
                  message: "La base de données n'est pas accessible.",
                  className,
                },
                503,
              );

        } else {
          this.response(
            ctx,
            { message: "Le produit pour lequel vous souhaitez laisser un avis, est momentanément inaccessible." },
            503,
          );
        }

      }
    );
  }
}
