import { DefaultController } from "./DefaultController.ts";
import { dynamicRoutes } from "@dynamic-routes";
import {
  LogController,
  type RouterAppType,
  type RouterContextAppType,
  type SelectUserFromDBType,
  type GetCollectionType,
  type SessionType,
  type UpdateUserToDBType,
} from "./mod.ts";
import { ObjectId } from "@deps";
import { FormDataAppType, Validator } from "@utils";
import { FormDataType } from "@components";

type UpdateUserMessageParameterType = {
  isUpdate: boolean;
  userName: string;
  updateOrDeleteStr?: string;
};

export class AdminController extends DefaultController {
  public collection;
  public selectFromDB;
  private updateToDB;
  private log;

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
    selectFromDB: SelectUserFromDBType,
    updateToDB: UpdateUserToDBType,
  ) {
    super(router);
    this.collection = collection;
    this.selectFromDB = selectFromDB;
    this.updateToDB = updateToDB;
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

          if (!dataParsed.isOk) {
            return this.response(
              ctx,
              {
                title: "Modification non effectuée",
                message: dataParsed.message
              },
              401,
            );
          }

          // Check to remove user photo.
          if (dataParsed.data["deletePicture"] === "oui") {
            dataParsed.data["photo"] = this.defaultImg;
          }

          // Remove 'delePicture' cause is unnecessary at this step.
          delete dataParsed.data["deletePicture"];

          const {
            firstname,
            lastname
          } = dataParsed.data as Pick<
            FormDataAppType,
            "firstname" | "lastname"
          >;

          const isUpdate = await this.updateToDB(
            _id,
            dataParsed.data,
            "users"
          );

          return this.response(
            ctx, 
            {
              title: "Modification utilisateur",
              message: this.msgAboutUserToAdmin({
                isUpdate,
                userName: `${firstname} ${lastname}`,
              }),
            },
            200,
          );
            
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    )
  }


  private msgAboutUserToAdmin = ({
    isUpdate,
    userName,
    updateOrDeleteStr = "mis à jour",
  }: UpdateUserMessageParameterType,
  ) => (
    `Le profil de ${userName} ${
      isUpdate ? "a bien" : "n'a pas"
    } été ${updateOrDeleteStr}.`
  );
}