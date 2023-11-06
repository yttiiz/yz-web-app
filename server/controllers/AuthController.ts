import { oak } from "@deps";
import { Auth } from "@auth";
import { DefaultController } from "./DefaultController.ts";
import type {
  InsertUserIntoDBType,
  PathAppType,
  RouterAppType,
  RouterContextAppType,
  SelectUserFromDBType,
} from "./mod.ts";

export class AuthController extends DefaultController {
  private defaultImg;
  private insertIntoDB;
  private selectFromDB;

  constructor(
    router: RouterAppType,
    insertIntoDB: InsertUserIntoDBType,
    selectFromDB: SelectUserFromDBType,
  ) {
    super(router);
    this.insertIntoDB = insertIntoDB;
    this.selectFromDB = selectFromDB;
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
    this.postRoute("/login", this.loginRouteHandler);
  }

  private postLogoutRoute() {
    this.postRoute("/logout", this.logoutRouteHandler);
  }

  private getRegisterRoute() {
    this.getRoute("/register", "s'enregister");
  }

  private postRegisterRoute() {
    this.postRoute("/register", this.registerRouteHandler);
  }

  private getRoute(path: PathAppType, title: string) {
    this.router?.get(path, async (ctx: RouterContextAppType<typeof path>) => {
      if (ctx.state.session) {
        const body = await this.createHtmlFile(
          ctx,
          "data-users-form",
          title,
          path,
        );
        this.response(ctx, body, 200);
      } else {
        this.response(ctx, { errorMsg: this.errorMsg }, 302, "/");
      }
    });
  }

  private postRoute(
    path: PathAppType,
    handler: (ctx: RouterContextAppType<typeof path>) => Promise<void>,
  ) {
    this.router?.post(path, handler);
  }

  private loginRouteHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const data = await ctx.request.body().value as oak.FormDataReader;
    const { fields: { email, password } } = await data.read();

    const failedLogin = async (message: string) => {
      const failedLoginAttempts =
        (await ctx.state.session.get("failed-login-attempts") || 0) as number;
      ctx.state.session.set("failed-login-attempts", failedLoginAttempts + 1);
      ctx.state.session.flash("error", message);
    };

    try {
      const user = await this.selectFromDB(email, "users");

      if ("_id" in user) {
        const isPasswordOk = await Auth.comparePassword(password, user.hash);

        // Handle session and redirection.
        if (isPasswordOk) {
          ctx.state.session.set("userEmail", email);
          ctx.state.session.set("userFirstname", user.firstname);
          ctx.state.session.set("userId", user._id);
          ctx.state.session.set("failed-login-attempts", null);
          ctx.state.session.flash(
            "message",
            this.sessionFlashMsg(email),
          );

          ctx.state.session.has("error")
            ? ctx.state.session.set("error", null)
            : null;

          this.response(ctx, user, 302, "/");
        } else {
          await failedLogin("mot de passe incorrect");
          this.response(
            ctx,
            { message: "votre mot de passe est incorrect" },
            200,
          );
        }
      } else {
        if (user.message === "connexion failed") {
          this.response(ctx, { errorMsg: this.errorMsg }, 302, "/");
        } else {
          await failedLogin(user.message);
          this.response(ctx, user, 200);
        }
      }
    } catch (error) {
      this.helper.writeLog(error);
      this.response(ctx, { errorMsg: this.errorMsg }, 500);
    }
  };

  private logoutRouteHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    await ctx.state.session.deleteSession();
    const msg = {
      message: "Utilisateur déconnecté",
    };
    this.response(ctx, msg, 302, "/");
  };

  private registerRouteHandler = async <T extends PathAppType>(
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

    const hash = await Auth.hashPassword(password);

    const userId = await this.insertIntoDB({
      firstname,
      lastname,
      email,
      birth: new Date(birth),
      role: "user",
      job,
      hash,
      photo,
    }, "users");

    userId === "connexion failed"
      ? this.response(ctx, { errorMsg: this.errorMsg }, 502)
      : this.response(
        ctx,
        {
          id: userId,
          name: `${firstname} ${lastname}`,
        },
        200,
      );
  };
}
