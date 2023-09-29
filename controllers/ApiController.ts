import {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
  UserDataType,
} from "./mod.ts";
import { Http } from "@utils";

export class ApiController {
  private router;
  private collection;

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
  ) {
    this.router = router;
    this.collection = collection;
    this.users();
  }

  private users() {
    this.router.get("/api", async (ctx: RouterContextAppType<"/api">) => {
      const users: UserDataType = {};

      try {
        const cursor = await this.collection("users");
        await cursor.map((document, i) => users[i] = document);

        this.response(ctx, JSON.stringify(users));
      } catch (error) {
        this.writeLog(error);
      }
    });
  }

  private response<T extends string>(
    ctx: RouterContextAppType<T>,
    data: string,
    http = new Http(ctx),
  ) {
    data.length > 2
      ? (
        http
          .setHeaders({ name: "Content-Type", value: "application/json" })
          .setResponse(data, 200)
      )
      : (
        http
          .setHeaders({
            name: "Content-Type",
            value: "text/plain; charset=UTF-8",
          })
          .setResponse(
            "Impossible de se connecter à la base de données.",
            500,
          )
      );
  }

  private async writeLog(
    error: { message: string },
    encoder = new TextEncoder(),
    opts = { append: true },
  ) {
    const DateOpts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const date = Intl
      .DateTimeFormat("fr-FR", DateOpts)
      .format(new Date());

    const errorMsg = `(${date}) ${error.message},\n`;
    const content = encoder.encode(errorMsg);

    await Deno.writeFile("log/log.txt", content, opts);
  }
}
