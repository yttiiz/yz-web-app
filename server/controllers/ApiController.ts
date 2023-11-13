import { Helper, Http } from "@utils";
import type {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
  SelectUserFromDBType,
  UserDataType,
} from "./mod.ts";
import type { FindCursorUserType, UserSchemaWithIDType } from "@mongo";

export class ApiController {
  private router;
  private collection;
  private selectFromDB;
  private helper;
  private errorMsg = "Impossible de se connecter à la base de données.";
  private contentType = {
    name: "Content-Type",
    value: "application/json",
  };

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
    selectFromDB: SelectUserFromDBType,
  ) {
    this.router = router;
    this.collection = collection;
    this.selectFromDB = selectFromDB;
    this.helper = Helper;
    this.users();
    this.userProfil();
  }

  private users() {
    this.router.get("/users", async (ctx: RouterContextAppType<"/users">) => {
      const users: UserDataType = {};
      const cursor = await this.collection("users");

      try {
        if (cursor) {
          await (cursor as FindCursorUserType)
            .map((document, key) => users[key + 1] = document);

          // Remove "_id" and "hash" properties from `users` object.
          for (const key in users) {
            for (const prop in users[key]) {
              if (prop === "_id") delete users[key][prop];
              if (prop === "hash") delete users[key][prop];
            }
          }

          this.response(ctx, JSON.stringify(users), 200);
        } else {
          this.response(
            ctx,
            JSON.stringify({
              errorMsg: this.errorMsg,
            }),
            502,
          );
        }
      } catch (error) {
        this.writeErrorLogAndSetResponse(ctx, error);
      }
    });
  }

  private userProfil() {
    this.router.get(
      "/user-profil",
      async (ctx: RouterContextAppType<"/user-profil">) => {
        try {
          const email = await ctx.state.session.get("userEmail");
          const {
            firstname,
            lastname,
            birth,
            job,
            photo,
          } = await this.selectFromDB(email, "users") as UserSchemaWithIDType;

          this.response(
            ctx,
            JSON.stringify({
              firstname,
              lastname,
              birth,
              job,
              photo,
              email,
            }),
            200,
          );
        } catch (error) {
          this.writeErrorLogAndSetResponse(ctx, error);
        }
      },
    );
  }

  private writeErrorLogAndSetResponse<T extends string>(
    ctx: RouterContextAppType<T>,
    error: { message: string },
  ) {
    this.helper.writeLog(error);
    this.response(
      ctx,
      JSON.stringify({
        errorMsg: this.errorMsg,
      }),
      500,
    );
  }

  private response<T extends string>(
    ctx: RouterContextAppType<T>,
    data: string,
    status: number,
  ) {
    new Http(ctx)
      .setHeaders(this.contentType)
      .setResponse(data, status);
  }
}
