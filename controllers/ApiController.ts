import {
  GetCollectionType,
  RouterAppType,
  RouterContextAppType,
  UserDataType,
} from "./mod.ts";

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

      } catch (error) {
        console.log(error.message);
      }

      this.response(ctx, JSON.stringify(users));
    });
  }

  private response<T extends string>(
    ctx: RouterContextAppType<T>,
    data: string,
  ) {
    const fillResponse = (
      contentType: string,
      body: string,
      status: number,
    ) => {
      ctx.response.headers.append("Content-Type", contentType);
      ctx.response.body = body;
      ctx.response.status = status;
    };

    data.length > 2
      ? fillResponse("application/json", data, 200)
      : fillResponse(
        "text/plain; charset=UTF-8",
        "Impossible de se connecter à la base de données.",
        500,
      );
  }
}
