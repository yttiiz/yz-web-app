import { Helper, Http } from "@utils";
import type {
  GetCollectionType,
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
  private errorMsg =
    "Impossible de se connecter à la base de données de l'api.";
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
    this.getUserFormContent();
  }

  private users() {
    this.getDataFromDB("users");
  }

  private products() {
    this.getDataFromDB("products");
  }

  private bookings() {
    this.getDataFromDB("bookings");
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

  private getUserFormContent() {
    this.router?.get(
      "/user-form-content",
      async (ctx: RouterContextAppType<"/user-form-content">) => {
        try {
          const content = await this.helper.convertJsonToObject(
            "/server/data/profil/profil.json",
          );
          this.response(ctx, JSON.stringify(content), 200);
        } catch (error) {
          this.writeErrorLogAndSetResponse(ctx, error);
        }
      },
    );
  }

  private getDataFromDB(collection: string) {
    const path = "/" + collection;

    this.router.get(path, async (ctx: RouterContextAppType<typeof path>) => {
      const data: UserDataType = {};
      const cursor = await this.collection(collection);

			if (this.isNotAuthorized(ctx)) {
				return this.response(
					ctx,
					JSON.stringify({
						errorMsg: "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
					}),
					403,
				);
			}

      try {
        if ("message" in cursor) {
          this.response(
            ctx,
            JSON.stringify({
              errorMsg: this.errorMsg,
            }),
            502,
          );
        } else {
          await cursor
            .map((document, key) => data[key + 1] = document);

          // Remove "hash" property from `users` object.
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

  private isNotAuthorized<T extends string>(
    ctx: RouterContextAppType<T>
  ) {
    return !(
      ctx.request.url.searchParams.get("apiKey") === Deno.env.get("API_KEY")
    );
  }
}
