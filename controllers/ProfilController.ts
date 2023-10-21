import { DefaultController } from "./DefaultController.ts";
import type {
  InsertIntoDBType,
  RouterAppType,
  RouterContextAppType,
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
      try {
        const body = await this.createHtmlFile(
          ctx,
          "data-profil-form",
          "modifier votre profil"
        );

        this.response(ctx, body, 200);
      
      } catch(error) {
        this.helper.writeLog(error);
        console.log(error);
      }
    });
  }
}
