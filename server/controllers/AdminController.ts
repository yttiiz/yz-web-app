import { DefaultController } from "./DefaultController.ts";
import { dynamicRoutes } from "@dynamic-routes";
import {
  LogController,
  type RouterAppType,
  type RouterContextAppType,
  type SelectUserFromDBType,
  type GetCollectionType,
  type SessionType,
} from "./mod.ts";
import { ObjectId } from "@deps";
import { Validator } from "@utils";
import { UserDataType } from "@/server/controllers/types.ts";
import { FormDataType } from "@components";

export class AdminController extends DefaultController {
  public collection;
  public selectFromDB;
  private log;

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
    selectFromDB: SelectUserFromDBType,
  ) {
    super(router);
    this.collection = collection;
    this.selectFromDB = selectFromDB;
    this.log = new LogController(this);
    this.getAdmin();
    this.postAdmin();
    this.postAdminLogout();
    this.putUser()
  }

  private getAdmin() {
    this.router?.get(
      "/admin",
      async (ctx: RouterContextAppType<"/admin">) => {
        const users = await this.collection("users");

        try {
          // If connexion to DB failed, redirect to home.
          if ("message" in users) {
            return this.response(ctx, "", 302, "/");
          }
          
          const isUserConnected = (ctx.state.session as SessionType).has("userId");

          const body = await this.createHtmlFile(
            ctx,
            {
              id: "data-admin",
              css: "admin",
              title: isUserConnected
              ? "bienvenue sur la plateforme d'admin"
              : "connexion à l'admin"
            }
          );

          this.response(
            ctx,
            body,
            200,
          );

        } catch (error) {
          this.helper.writeLog(error);
        }
      }
    );
  }

  private postAdmin() {
    this.router?.post(
      "/admin",
      this.log.loginHandler,
    );
  }

  private postAdminLogout() {
    this.router?.post(
      "/admin-logout",
      this.log.logoutHandler,
    );
  }

  private putUser() {
    const userRoute = `/${dynamicRoutes.get("user")}:id`; // "/user/:id"
    
    this.router?.put(
      userRoute,
      async (ctx: RouterContextAppType<typeof userRoute>) => {
        try {
          const _id = new ObjectId(ctx.params.id);
          const formData = await ctx.request.body.formData();
          const dataModel = await this.helper.convertJsonToObject(
            "/server/data/admin/user-form.json",
          ) as FormDataType;
          
          const dataParsed = Validator.dataParser(
            formData,
            dataModel,
          );

          // TODO implements logic here.
          
          return this.response(
            ctx, 
            {
              title: "Modification utilisateur",
              message: "L'utilisateur a bien été mis à jour",
            },
            200,
          );
          
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    )
  }

}