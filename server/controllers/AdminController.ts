import { DefaultController } from "./DefaultController.ts";
import {
  LogController,
  type GetCollectionType,
  type RouterAppType,
  type RouterContextAppType,
  type SelectUserFromDBType,
} from "./mod.ts";

export class AdminController extends DefaultController {
  private collection;
  public selectFromDB;
  private log;
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
    this.log = new LogController(this);
    this.getAdmin();
    this.postAdmin();
    this.postAdminLogout();
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
      this.log.loginHandler,
    )
  }

  private postAdminLogout() {
    this.router?.post(
      "/admin-logout",
      this.log.logoutHandler,
    )
  }
}