import { Helper, Http } from "@utils";
import type {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
  SelectUserFromDBType,
  UserDataType,
} from "./mod.ts";
import type {
  FindCursorBookingsProductType,
  FindCursorProductType,
  FindCursorUserType,
  UserSchemaWithIDType
} from "@mongo";

type FindCursorCollectionType =
  | FindCursorUserType
  | FindCursorProductType
  | FindCursorBookingsProductType;

export class ApiController {
  private router;
  private collection;
  private selectFromDB;
  private helper;
  private errorMsg = "Impossible de se connecter à la base de données de l'api.";
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
    this.products();
    this.bookings();
    this.userProfil();
  }

  private users() {
    this.getDataFromDB<FindCursorUserType>("users");
  }

  private products() {
    this.getDataFromDB<FindCursorProductType>("products");
  }

  private bookings() {
    this.getDataFromDB<FindCursorBookingsProductType>("bookings");
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
          } = await this.selectFromDB(
            "users",
            email,
            "email",
          ) as UserSchemaWithIDType;

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

  private getDataFromDB<T extends FindCursorCollectionType>(collection: string) {
    const path = "/" + collection;

    this.router.get(path, async (ctx: RouterContextAppType<typeof path>) => {
      const data: UserDataType = {};
      const cursor = await this.collection(collection);

      try {
        if ("message" in cursor && cursor["message"].includes("failed")) {
          this.response(
            ctx,
            JSON.stringify({
              errorMsg: this.errorMsg,
            }),
            502,
          );

        } else {
          await (cursor as T)
            .map((document, key) => data[key + 1] = document);

          // Remove "_id" and "hash" properties from `users` object.
          for (const key in data) {
            for (const prop in data[key]) {
              if (prop === "hash") delete data[key][prop];
            }
          }

          this.response(ctx, JSON.stringify(data), 200);
          
        }
      } catch (error) {
        this.writeErrorLogAndSetResponse(ctx, error);
      }
    });
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
