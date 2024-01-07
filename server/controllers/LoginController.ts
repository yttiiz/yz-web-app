import { Validator } from "@utils";
import { 
  AdminController,
  AuthController,
  PathAppType,
  RouterContextAppType,
} from "@controllers";
import { Auth } from "@auth";
import { oak } from "@deps";

export class LoginController {
  default;

  constructor(
    defaultController: AuthController | AdminController,
  ) {
    this.default = defaultController;
  };

  public routeHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const isAdminRequest = ctx.request.url.pathname === "/admin";

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
      ctx.state.session.set("failed-login-attempts", failedLoginAttempts + 1);
      ctx.state.session.flash("error", message);
    };

    try {
      const user = await this.default.selectFromDB("users", email, "email");

      if ("_id" in user) {
        // Handle admin.
        if (isAdminRequest && user.role !== "admin") {
          return this.default.response(ctx, "access denied", 401);
        }

        const isPasswordOk = await Auth.comparePassword(password, user.hash);

        // Handle session and/or redirection.
        if (isPasswordOk) {
          ctx.state.session.set("userEmail", email);
          ctx.state.session.set("userFirstname", user.firstname);
          ctx.state.session.set("userPhoto", user.photo);
          ctx.state.session.set(
            "userFullname",
            `${user.firstname} ${user.lastname}`,
          );
          ctx.state.session.set("userId", user._id);
          ctx.state.session.set("failed-login-attempts", null);
          ctx.state.session.flash(
            "message",
            this.default.sessionFlashMsg(email),
          );

          ctx.state.session.has("error")
            ? ctx.state.session.set("error", null)
            : null;

          isAdminRequest
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
} 