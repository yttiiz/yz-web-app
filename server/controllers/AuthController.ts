import { DefaultController } from "./DefaultController.ts";
import { LogService } from "@services";
import type {
  PathAppType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";

export class AuthController extends DefaultController {
  private log;

  constructor(router: RouterAppType) {
    super(router);
    this.log = new LogService(this);
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
    this.postRoute("/register", this.log.registerHandler);
  }

  private getRoute(path: PathAppType, title: string) {
    this.router?.get(path, async (ctx: RouterContextAppType<typeof path>) => {
      const users = await this.mongo.connectionTo("users");

      if ("message" in users) {
        this.response(ctx, "", 302, "/");
      } else {
        const body = await this.createHtmlFile(ctx, {
          id: "data-user-form",
          css: "user-form",
          title,
          path,
        });

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
}
