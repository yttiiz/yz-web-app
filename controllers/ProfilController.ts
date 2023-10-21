import { DefaultController } from "./DefaultController.ts";
import type {
  RouterAppType,
  RouterContextAppType,
  InsertIntoDBType,
  SelectFromDBType,
} from "./mod.ts";

export class ProfilController extends DefaultController {
  constructor(
    router: RouterAppType,
    insertIntoDB: InsertIntoDBType,
    selectFromDB: SelectFromDBType,
  ) {
    super(router, insertIntoDB, selectFromDB);
    this.profil();
  }

  private profil() {
    this.router.get("/profil", async (ctx: RouterContextAppType<"/profil">) => {
      const body = await this.createHtmlFile(ctx, "data-users");
      this.response(ctx, body, 200);
    });
  }
}
