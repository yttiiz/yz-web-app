import { Auth } from "@auth";
import { DefaultController } from "./DefaultController.ts";
import { LogController } from "./mod.ts";
import type {
  GetCollectionType,
  InsertUserIntoDBType,
  PathAppType,
  RouterAppType,
  RouterContextAppType,
  SelectUserFromDBType,
} from "./mod.ts";
import { FormDataAppType, Validator } from "@utils";

export class AuthController extends DefaultController {
  private log;
  private defaultImg;
  private getCollection;
  private insertIntoDB;
  public selectFromDB;

  constructor(
    router: RouterAppType,
    getCollection: GetCollectionType,
    insertIntoDB: InsertUserIntoDBType,
    selectFromDB: SelectUserFromDBType,
  ) {
    super(router);
    this.getCollection = getCollection;
    this.insertIntoDB = insertIntoDB;
    this.selectFromDB = selectFromDB;
    this.log = new LogController(this);
    this.defaultImg = "/img/users/default.png";
    this.getLoginRoute();
    this.getRegisterRoute();
    this.postLoginRoute();
    this.postRegisterRoute();
    this.postLogoutRoute();
  }

  private getLoginRoute() {
    this.getRoute("/login", "se connecter");
  }

  private postLoginRoute() {
    this.postRoute("/login", this.log.loginHandler);
  }

  private postLogoutRoute() {
    this.postRoute("/logout", this.log.logoutHandler);
  }

  private getRegisterRoute() {
    this.getRoute("/register", "s'enregister");
  }

  private postRegisterRoute() {
    this.postRoute("/register", this.registerRouteHandler);
  }

  private getRoute(path: PathAppType, title: string) {
    this.router?.get(path, async (ctx: RouterContextAppType<typeof path>) => {
      const users = await this.getCollection("users");

      if ("message" in users) {
        this.response(ctx, "", 302, "/");

      } else {
        const body = await this.createHtmlFile(
          ctx,
          {
            id: "data-user-form",
            css: "user-form",
            title,
            path,
          },
        );

        this.response(ctx, body, 200);
      }
    });
  }

  private postRoute(
    path: PathAppType,
    handler: (ctx: RouterContextAppType<typeof path>) => Promise<void>,
  ) {
    this.router?.post(path, handler);
  }

  private registerRouteHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const dataModel = await this.helper.convertJsonToObject(
      `/server/data/authentication${ctx.request.url.pathname}.json`,
    );
    const formData = await ctx.request.body.formData();
    const dataParsed = Validator.dataParser(formData, dataModel);

    if (!dataParsed.isOk) {
      return this.response(
        ctx,
        { message: dataParsed.message },
        200,
      );
    }

    let picPath: string;

    const {
      lastname,
      firstname,
      email,
      birth,
      password,
      job,
      photo,
    } = dataParsed.data as FormDataAppType;

    photo
      ? picPath = await this.helper.writeUserPicFile(
        photo,
        firstname,
        lastname,
      )
      : picPath = this.defaultImg;

    const hash = await Auth.hashPassword(password as string);

    const userId = await this.insertIntoDB({
      firstname,
      lastname,
      email,
      birth: new Date(birth),
      role: "user",
      job,
      hash,
      photo: picPath,
    }, "users");

    userId === "connexion failed"
      ? this.response(ctx, { errorMsg: this.errorMsg }, 502)
      : this.response(
        ctx,
        {
          message:
            `${firstname} ${lastname}, votre profil a été créé avec succès.`,
        },
        200,
      );
  };
}
