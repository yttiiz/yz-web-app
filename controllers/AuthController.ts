import { oak } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import { Auth } from "@auth";
import {
  AuthPathType,
  FilesDataType,
  InsertIntoDBType,
  RouterAppType,
  RouterContextAppType,
  SelectFromDBType,
} from "./mod.ts";

export class AuthController extends DefaultController {
  public insertIntoDB;
  public selectFromDB;
  private defaultImg;

  constructor(
    router: RouterAppType,
    insertIntoDB: InsertIntoDBType,
    selectFromDB: SelectFromDBType,
  ) {
    super(router);
    this.insertIntoDB = insertIntoDB;
    this.selectFromDB = selectFromDB;
    this.defaultImg = "/img/users/default.png";
    this.getLoginRoute();
    this.getRegisterRoute();
    this.postLoginRoute();
    this.postRegisterRoute();
  }

  private getLoginRoute() {
    this.getRoute("/login", "- se connecter");
  }

  private postLoginRoute() {
    this.postRoute("/login", this.loginRouteHandler);
  }

  private getRegisterRoute() {
    this.getRoute("/register", "- s'enregister");
  }

  private postRegisterRoute() {
    this.postRoute("/register", this.registerRouteHandler);
  }

  private getRoute(path: AuthPathType, title: string) {
    this.router.get(path, async (ctx: RouterContextAppType<typeof path>) => {
      const body = await this.createHtmlFile(
        ctx,
        "data-users-form",
        title,
        path,
      );
      this.response(ctx, body, 200);
    });
  }

  private postRoute(
    path: AuthPathType,
    handler: (ctx: RouterContextAppType<typeof path>) => Promise<void>,
  ) {
    this.router.post(path, handler);
  }

  private loginRouteHandler = async <T extends AuthPathType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const data = await ctx.request.body().value as oak.FormDataReader;
    const { fields: { email, password } } = await data.read();

    try {
      const user = await this.selectFromDB(email, "users");

      if (user && "_id" in user) {
        const key = await Auth.importKey(user.key);
        const passwordStored = await Auth.decryptPassword(user.hash, key);

        //Handle session and potential redirection.
        if (email === user.email && password === passwordStored) {
          ctx.state.session.set("email", email);
          ctx.state.session.set("firstname", user.firstname);
          ctx.state.session.set("failed-login-attempts", null);
          ctx.state.session.flash(
            "message",
            `connexion réussie : ${email}`,
          );
  
          this.response(ctx, user, 302, "/");
        }
      } else {
        const failedLoginAttempts =
          (await ctx.state.session.get("failed-login-attempts") || 0) as number;
        ctx.state.session.set("failed-login-attempts", failedLoginAttempts + 1);
        ctx.state.session.flash("error", "Incorrect username or password");

        this.response(ctx, user, 200);
      }
    } catch (error) {
      this.helper.writeLog(error);
      this.response(
        ctx,
        {
          errorMsg:
            "Impossible de se connecter à la base de données. Code erreur : ",
        },
        500,
      );
    }
  };

  private registerRouteHandler = async <T extends AuthPathType>(
    ctx: RouterContextAppType<T>,
  ) => {
    let photo: string;
    const data = await ctx.request.body().value as oak.FormDataReader;

    const {
      fields: {
        lastname,
        firstname,
        email,
        birth,
        password,
        job,
      },
      files,
    } = await data.read({ maxSize: 10_000_000 });

    files
      ? photo = await this.fileHandler(
        files,
        firstname,
        lastname,
      )
      : photo = this.defaultImg;

    const { hash, key } = await Auth.encryptPassword(password);
    const rawKey = await Auth.exportKey(key)
    
    const userId = await this.insertIntoDB({
      firstname,
      lastname,
      email,
      birth: new Date(birth),
      role: "user",
      job,
      hash,
      key: rawKey,
      photo,
    }, "users");

    this.response(
      ctx,
      {
        id: userId,
        name: `${firstname} ${lastname}`,
      },
      200,
    );
  };

  private async fileHandler(
    files: FilesDataType,
    firstname: string,
    lastname: string,
  ) {
    const [file] = files;
    const ext = file.contentType.split("/").at(1) as string;
    const photo =
      `img/users/${firstname.toLowerCase()}_${lastname.toLowerCase()}.${ext}`;

    await Deno.writeFile(`public/${photo}`, file.content as Uint8Array);

    return photo;
  }
}
