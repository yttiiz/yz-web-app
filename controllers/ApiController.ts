import {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
  UserDataType,
} from "./mod.ts";
import { Helper, Http } from "@utils";

export class ApiController {
  private router;
  private collection;
  private helper;

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
  ) {
    this.router = router;
    this.collection = collection;
    this.helper = Helper;
    this.users();
  }

  private users() {
    this.router.get("/api", async (ctx: RouterContextAppType<"/api">) => {
      const users: UserDataType = {};
      const contentType = {
        name: "Content-Type",
        value: "application/json",
      };

      try {
        const cursor = await this.collection("users");
        await cursor.map((document, i) => users[i] = document);

        new Http(ctx)
          .setHeaders(contentType)
          .setResponse(JSON.stringify(users), 200);
      } catch (error) {
        this.helper.writeLog(error);

        new Http(ctx)
          .setHeaders(contentType)
          .setResponse(
            JSON.stringify({
              errorMsg: "Impossible de se connecter à la base de données.",
            }),
            500,
          );
      }
    });
  }
}
