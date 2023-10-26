import { oak } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type {
  RouterAppType,
  RouterContextAppType,
  UpdateUserToDBType,
} from "./mod.ts";
import { Auth } from "@auth";
import type { UserSchemaWithOptionalFieldsType } from "@mongo";

export class ProfilController extends DefaultController {
  private updateToDB;

  constructor(
    router: RouterAppType,
    updateToDB: UpdateUserToDBType,
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
    
      let photo = "";
      const data = await ctx.request.body().value as oak.FormDataReader;
      const { fields, files } = await data.read({ maxSize: 10_000_000 });
      
      files
      ? photo = await this.fileHandler(
        files,
        fields.firstname,
        fields.lastname
      )
      : null; 

      const updatedData = await this.removeEmptyFields(fields);
      photo ? updatedData.photo = photo : null;

      const isUserUpdate = await this.updateToDB(fields.email, updatedData, "users");

      if (fields.firstname) {
        ctx.state.session.set("firstname", fields.firstname);
      }
      
      ctx.state.session.set("email", fields.email);
      ctx.state.session.flash("message", this.sessionFlashMsg(fields.email));

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
