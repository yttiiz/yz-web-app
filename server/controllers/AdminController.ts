import type {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";
import { DefaultController } from "./DefaultController.ts";

export class AdminController extends DefaultController {
  private collection;
  private contentTypeJon = {
    name: "Content-Type",
    value: "application/json",
  };
  private contentTypeHtml = {
    name: "Content-Type",
    value: "text/html; charset=UTF-8",
  };

  constructor(
    router: RouterAppType,
    getCollection: GetCollectionType,
  ) {
    super(router);
    this.collection = getCollection;
    this.getAdmin();
  }

  private getAdmin() {
    this.router?.get(
      "/admin",
      async (ctx: RouterContextAppType<"/admin">) => {
        const body = await this.createHtmlFile(
          ctx,
          {
            id: "data-admin",
            css: "admin",
            title: "connexion à l'administration"
          }
        );

        this.response(
          ctx,
          body,
          200,
        );
      }
    )
  }
}