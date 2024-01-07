import { DefaultController } from "./DefaultController.ts";
import {
  LoginController,
  type GetCollectionType,
  type RouterAppType,
  type RouterContextAppType,
  type SelectUserFromDBType,
} from "./mod.ts";

export class AdminController extends DefaultController {
  private collection;
  public selectFromDB;
  private login;
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
    selectFromDB: SelectUserFromDBType,
  ) {
    super(router);
    this.collection = getCollection;
    this.selectFromDB = selectFromDB;
    this.login = new LoginController(this);
    this.getAdmin();
    this.postAdmin();
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

  private postAdmin() {
    this.router?.post(
      "/admin",
      this.login.routeHandler,
    )
  }
}