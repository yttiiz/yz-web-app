import { oak } from "../dependencies/deps.ts";
import { DefaultController } from "./DefaultController.ts";
import {
  AuthPathType,
  FilesDataType,
  InsertIntoDBType,
  RouterAppType,
  RouterContextAppType,
  SelectFromDBType,
} from "./mod.ts";

export class AuthController extends DefaultController {
  insertIntoDB;
  selectFromDB;
  defaultImg;

  /**
   * @param router The app router
   * @param insertIntoDB Creates a new user in BD and returns it's ID.
   * @param selectFromDB Select a user according to a given email.
   */
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
      const body = await this.createHtmlFile("data-users-form", title, path);
      this.response(ctx, body);
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
    const { fields: { email } } = await data.read();
    const user = await this.selectFromDB(email, "users");

    this.response(ctx, user, "/");
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

    const userId = await this.insertIntoDB({
      firstname,
      lastname,
      email,
      dateOfBirth: new Date(birth),
      role: "user",
      job,
      photo,
    }, "users");

    this.response(ctx, {
      id: userId,
      name: `${firstname} ${lastname}`,
    });
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
