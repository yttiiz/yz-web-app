import { RouterAppType, RouterContextAppType } from "./mod.ts";
import { FindCursorType, UserSchemaWithIDType } from "@mongo";

export class ApiController {
  #router;
  #collection;

  constructor(
    router: RouterAppType,
    collection: () => Promise<FindCursorType>,
  ) {
    this.#router = router;
    this.#collection = collection;
    this.#users();
  }

  #users() {
    this.#router.get("/api", async (ctx: RouterContextAppType<"/api">) => {
      const users: { [key: number]: UserSchemaWithIDType } = {};
      const cursor = await this.#collection();

      await cursor.map((document, i) => users[i] = document);

      this.#response(ctx, JSON.stringify(users));
    });
  }

  #response<T extends string>(
    ctx: RouterContextAppType<T>,
    data: string,
  ) {
    ctx.response.headers.append("Content-Type", "application/json");
    ctx.response.body = data;
    ctx.response.status = 200;
  }
}
