import { oak } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type {
  RouterAppType,
  RouterContextAppType,
  UpdateToDBType,
} from "./mod.ts";
import { Auth } from "@auth";
import type { UserSchemaWithOptionalFieldsType } from "@mongo";

export class ProfilController extends DefaultController {
  private updateToDB;

  constructor(
    router: RouterAppType,
    updateToDB: UpdateToDBType,
  ) {
    super(router);
    this.updateToDB = updateToDB;
    this.getProfil();
    this.putProfil();
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
        this.response(ctx, { errorMsg: this.errorMsg }, 500);
      }
    });
  }

  private putProfil() {
    this.router.put("/profil", async (ctx: RouterContextAppType<"/profil">) => {
    
      const data = await ctx.request.body().value as oak.FormDataReader;
      const { fields, files } = await data.read();
      //TODO WIP handle files field and required field (e.g: "email")
      const updatedData = await this.removeEmptyFields(fields);
      const isUserUpdate = await this.updateToDB(fields.email, updatedData, "users");

      isUserUpdate
      ? this.response(ctx, { message: "Votre profil a bien été mis à jour" }, 200)
      : this.response(ctx, { message: "Vos informations n'ont pas été mis à jour" }, 200);
    });
  }

  private async removeEmptyFields(
    fields: Record<string, string>,
  ) {
    const trustData = Object.keys(fields)
    .filter(key => fields[key] !== "")
    .reduce((acc, key) => {
      key === "birth"
      ? acc["birth"] = new Date(fields[key])
      : acc[key as keyof Omit<typeof acc, "birth">] = fields[key];
      
      return acc;
    }, {} as UserSchemaWithOptionalFieldsType & { password?: string });

    if (trustData["password"]) {
      trustData["hash"] = await Auth.hashPassword(trustData["password"]);
      delete trustData["password"];
    }

    return trustData;
  }
}
