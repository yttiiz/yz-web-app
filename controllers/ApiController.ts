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
    this.#loginFile();
    this.#registerFile();
  }

  #users() {
    this.#router.get("/api", async (ctx: RouterContextAppType<"/api">) => {
      const users: { [key: number]: UserSchemaWithIDType } = {};
      const cursor = await this.#collection();

      await cursor.map((document, i) => users[i] = document);

      this.#response(ctx, JSON.stringify(users));
    });
  }

  #loginFile() {
    this.#getData("login");
  }

  #registerFile() {
    this.#getData("register");
  }

  #getData(dataName: string) {
    const route = `/${dataName}-data`;

    this.#router.get(route, async (ctx: RouterContextAppType<typeof route>) => {
      const decoder = new TextDecoder("utf-8");
      const file = await Deno.readFile(`${Deno.cwd()}/data/${dataName}.json`);
      const json = decoder.decode(file);

      this.#response(ctx, json);
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
