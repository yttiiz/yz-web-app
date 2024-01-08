import { Validator } from "@utils";
import { 
  AdminController,
  AuthController,
  PathAppType,
  RouterContextAppType,
  SessionType,
} from "@controllers";
import { Auth } from "@auth";
import { oak } from "@deps";

export class LogController {
  default;
  isAdmin;

  constructor(
    defaultController: AuthController | AdminController,
  ) {
    this.default = defaultController;
    this.isAdmin = this.default instanceof AdminController;
  };

  public loginHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const session: SessionType = ctx.state.session; 
    const data = await ctx.request.body().value as oak.FormDataReader;
    const dataModel = await this.default.helper.convertJsonToObject(
      `/server/data/authentication${ctx.request.url.pathname}.json`,
    );
    const dataParsed = Validator.dataParser(await data.read(), dataModel);

    if (!dataParsed.isOk) {
      return this.default.response(
        ctx,
        { message: dataParsed.message },
        200,
      );
    }

    const { fields: { email, password } } = dataParsed.data;

    const failedLogin = async (message: string) => {
      const failedLoginAttempts =
        (await ctx.state.session.get("failed-login-attempts") || 0) as number;
      session.set("failed-login-attempts", failedLoginAttempts + 1);
      session.flash("error", message);
    };

    try {
      const user = await this.default.selectFromDB("users", email, "email");

      if ("_id" in user) {
        // Handle admin.
        if (this.isAdmin && user.role !== "admin") {
          return this.default.response(ctx, "", 401);
        }

        const isPasswordOk = await Auth.comparePassword(password, user.hash);

        // Handle session and/or redirection.
        if (isPasswordOk) {
          session.set("userEmail", email);
          session.set("userFirstname", user.firstname);
          session.set("userPhoto", user.photo);
          session.set(
            "userFullname",
            `${user.firstname} ${user.lastname}`,
          );
          session.set("userId", user._id);
          session.set("failed-login-attempts", null);
          session.flash(
            "message",
            this.default.sessionFlashMsg(email),
          );

          session.has("error")
            ? session.set("error", null)
            : null;

          this.isAdmin
            ? this.default.response(ctx, { message: "connected" }, 200)
            : this.default.response(ctx, "", 302, "/");

        } else {
          await failedLogin("mot de passe incorrect");
          this.default.response(
            ctx,
            {
              message: "Veuillez réessayer, votre mot de passe est incorrect.",
            },
            200,
          );
        }
      } else {
        if (user.message === "connexion failed") {
          this.default.response(ctx, "", 302, "/");

        } else {
          await failedLogin(user.message);
          this.default.response(ctx, user, 200);
        }
      }
    } catch (error) {
      this.default.helper.writeLog(error);
      this.default.response(ctx, { errorMsg: this.default.errorMsg }, 500);
    }
  };

  public logoutHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    await ctx.state.session.deleteSession();

    this.isAdmin
      ? this.default.response(ctx, "", 302, "/admin" )
      : this.default.response(ctx, "", 302, "/");
  };
} 