import { oak } from "../dependencies/dept.ts";
import { DefaultController } from "./DefaultController.ts";
import {
  AuthPathType,
  FilesDataType,
  RouterAppType,
  RouterContextAppType,
  UserSchemaType,
  UserSchemaWithIDType,
} from "./mod.ts";

export class AuthController extends DefaultController {
  #insertIntoDB;
  #selectFromDB;
  #defaultImg;

  /**
   * @param router The app router
   * @param insertIntoDB Creates a new user in BD and returns it's ID.
   * @param selectFromDB Select a user according to a given email.
   */
  constructor(
    router: RouterAppType,
    insertIntoDB: (data: UserSchemaType) => Promise<string>,
    selectFromDB: (data: string) => Promise<UserSchemaWithIDType | string>,
  ) {
    super(router);
    this.#insertIntoDB = insertIntoDB;
    this.#selectFromDB = selectFromDB;
    this.#defaultImg = "/img/users/default.png";
    this.#getLoginRoute();
    this.#getRegisterRoute();
    this.#postLoginRoute();
    this.#postRegisterRoute();
  }

  #getLoginRoute() {
    this.#getRoute("/login", "- se connecter");
  }

  #postLoginRoute() {
    this.#postRoute("/login", this.#loginRouteHandler);
  }

  #getRegisterRoute() {
    this.#getRoute("/register", "- s'enregister");
  }

  #postRegisterRoute() {
    this.#postRoute("/register", this.#registerRouteHandler);
  }

  #getRoute(path: AuthPathType, title: string) {
    this.router.get(path, (ctx: RouterContextAppType<typeof path>) => {
      const body = this.createHtmlFile("data-users-form", title);
      this.response(ctx, body);
    });
  }

  #postRoute(
    path: AuthPathType,
    handler: (ctx: RouterContextAppType<typeof path>) => Promise<void>,
  ) {
    this.router.post(path, handler);
  }

  #loginRouteHandler = async <T extends AuthPathType>(
    ctx: RouterContextAppType<T>,
  ) => {
    const data = await ctx.request.body().value as oak.FormDataReader;
    const { fields: { email } } = await data.read();
    const user = await this.#selectFromDB(email);

    this.response(ctx, user);
  };

  #registerRouteHandler = async <T extends AuthPathType>(
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
      ? photo = this.#fileHandler(
        files,
        firstname,
        lastname,
      )
      : photo = this.#defaultImg;

    const userId = await this.#insertIntoDB({
      firstname,
      lastname,
      email,
      dateOfBirth: new Date(birth),
      role: "user",
      job,
      photo,
    });

    this.response(ctx, {
      id: userId,
      name: `${firstname} ${lastname}`,
    });
  };

  #fileHandler(
    files: FilesDataType,
    firstname: string,
    lastname: string,
  ) {
    let photo = this.#defaultImg;

    files
      .map(async (file) => {
        if (file.filename) {
          const ext = file.contentType.split("/").at(1) as string;
          photo =
            `img/users/${firstname.toLowerCase()}_${lastname.toLowerCase()}.${ext}`;

          await Deno.writeFile(`public/${photo}`, file.content as Uint8Array);
        }
      });

    return photo;
  }
}
