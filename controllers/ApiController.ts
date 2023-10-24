import { Helper, Http } from "@utils";
import type {
  GetCollectionUserType,
  RouterAppType,
  RouterContextAppType,
  SelectUserFromDBType,
  UserDataType,
} from "./mod.ts";
import type { UserSchemaWithIDType } from "@mongo";

export class ApiController {
  private router;
  private collection;
  private selectFromDB;
  private helper;
  private contentType = {
    name: "Content-Type",
    value: "application/json",
  };

  constructor(
    router: RouterAppType,
    collection: GetCollectionUserType,
    selectFromDB: SelectUserFromDBType
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

      try {
        const cursor = await this.collection("users");
        await cursor.map((document, key) => users[key + 1] = document);

        // Remove "_id" and "hash" properties from `users` object.
        for (const key in users) {
          for (const prop in users[key]) {
            if (prop === "_id") delete users[key][prop];
            if (prop === "hash") delete users[key][prop];
          }
        }

        this.setReponse(ctx, JSON.stringify(users), 200);

      } catch (error) {
        this.helper.writeLog(error);
        this.setReponse(
          ctx,
          JSON.stringify({
            errorMsg: "Impossible de se connecter à la base de données.",
          }),
          500,
        );
      }
    });
  }

  private userProfil() {
    this.router.get(
      "/user-profil",
      async (ctx: RouterContextAppType<"/user-profil">,
    ) => {
        try {
          const email = await ctx.state.session.get("email");
          const {
            firstname,
            lastname,
            birth,
            job,
            photo,
          } = await this.selectFromDB(email, "users") as UserSchemaWithIDType;

          this.setReponse(
            ctx,
            JSON.stringify({
              firstname,
              lastname,
              birth,
              job,
              photo,
              email
            }),
            200);
        
        } catch (error) {
          this.helper.writeLog(error);
          this.setReponse(
            ctx,
            JSON.stringify({
              errorMsg: "Impossible de se connecter à la base de données.",
            }),
            500,
          );
        }
    });
  }

  private setReponse<T extends string>(
    ctx: RouterContextAppType<T>,
    data: string,
    status: number,
    ) {
    new Http(ctx)
      .setHeaders(this.contentType)
      .setResponse(data, status);
  }
}
