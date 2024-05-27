import { Helper, Http } from "@utils";
import type {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
  SelectUserFromDBType,
  UserDataType,
} from "./mod.ts";
import type { UserSchemaWithIDType } from "@mongo";
import { cheerio, Document, FindCursor } from "@deps";

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
    this.getDataFromGuadeloupeIslandsWebsite();
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
        if (this.isNotAuthorized(ctx)) {
          return this.response(
            ctx,
            JSON.stringify({
              errorMsg:
                "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
            }),
            403,
          );
        }

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

  private getDataFromGuadeloupeIslandsWebsite() {
    this.router?.get(
      "/guadeloupe-islands",
      async (ctx: RouterContextAppType<"/guadeloupe-islands">) => {
        const host = "https://www.lesilesdeguadeloupe.com",
          address = host + "/tourisme/fr-fr";

        if (this.isNotAuthorized(ctx)) {
          return this.response(
            ctx,
            JSON.stringify({
              errorMsg:
                "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
            }),
            403,
          );
        }

        try {
          const res = await fetch(address);

          if (res.ok && res.status === 200) {
            const data = this.handleHtmlPage({ html: await res.text(), host });
            this.response(ctx, JSON.stringify(data), 200);
          } else {
            this.response(ctx, JSON.stringify({ error: res.statusText }), 404);
          }
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
      let data: UserDataType = {};
      const limit = ctx.request.url.searchParams.get("limit") ?? "";
      const cursor = await this.collection(collection);

      if (this.isNotAuthorized(ctx)) {
        return this.response(
          ctx,
          JSON.stringify({
            errorMsg:
              "Accès non autorisé : La clé d'api n'est pas bonne ou non fourni.",
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
          data = await this.queryDocuments({ limit, cursor, data });

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
    ctx: RouterContextAppType<T>,
  ) {
    return !(
      ctx.request.url.searchParams.get("apiKey") === Deno.env.get("API_KEY")
    );
  }

  private async queryDocuments({
    limit,
    cursor,
    data,
  }: {
    limit: string | undefined;
    cursor: FindCursor<Document>;
    data: UserDataType;
  }) {
    if (limit && typeof (+limit) === "number") {
      for (let i = 0; i < +limit; i++) {
        const document = await cursor.next();
        if (!document) break;

        data[i + 1] = document;
      }
    } else {
      await cursor
        .map((document, key) => data[key + 1] = document);
    }

    return data;
  }

  private handleHtmlPage({ html, host }: { html: string; host: string }) {
    const data: Record<string, Record<string, string>> = {};
    let index = 0;

    const $ = cheerio.load(html);

    $(".carousel-item", html)
      .each(function () {
        const link = $(this).children("a");
        const href = host + link.attr("href");
        const image = host + link.children("img").attr("src");
        const text = link.children("div").children("span").children("span")
          .text();

        if (href && image) {
          data[`${index + 1}`] = {
            href,
            image,
            text,
          };
        }

        index++;
      });

    return data;
  }
}
