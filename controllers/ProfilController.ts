import { DefaultController } from "./DefaultController.ts";
import type {
  InsertIntoDBType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";

export class ProfilController extends DefaultController {
  constructor(
    router: RouterAppType,
    insertIntoDB: InsertIntoDBType,
  ) {
    super(router, insertIntoDB);
    this.getProfil();
  }

  private getProfil() {
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
