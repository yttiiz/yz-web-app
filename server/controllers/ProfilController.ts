import { oak, ObjectId } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type {
  DeleteFromDBType,
  RouterAppType,
  RouterContextAppType,
  UpdateUserToDBType,
} from "./mod.ts";
import { Auth } from "@auth";
import type { UserSchemaWithOptionalFieldsType } from "@mongo";

export class ProfilController extends DefaultController {
  private updateToDB;
  private deleteFromDB;

  constructor(
    router: RouterAppType,
    updateToDB: UpdateUserToDBType,
    deleteFromDB: DeleteFromDBType,
  ) {
    super(router);
    this.updateToDB = updateToDB;
    this.deleteFromDB = deleteFromDB;
    this.getProfil();
    this.putProfil();
    this.deleteProfil();
  }

  private getProfil() {
    this.router?.get(
      "/profil",
      async (ctx: RouterContextAppType<"/profil">) => {
        if (!ctx.state.session) {
          this.response(ctx, { errorMsg: this.errorMsg }, 302, "/");
        } else if (ctx.state.session.has("userFirstname")) {
          const body = await this.createHtmlFile(
            ctx,
            {
              id: "data-profil-form",
              css: "user-form",
              title: "modifier votre profil",
            },
          );
          this.response(ctx, body, 200);
        } else {
          this.response(
            ctx,
            JSON.stringify({
              message: "pas d'utilisateur connecté",
            }),
            302,
            "/",
          );
        }
      },
    );
  }

  private putProfil() {
    this.router?.put(
      "/profil",
      async (ctx: RouterContextAppType<"/profil">) => {
        let photo = "";
        const data = await ctx.request.body().value as oak.FormDataReader;
        const { fields, files } = await data.read({ maxSize: 10_000_000 });
        const userId = await ctx.state.session.get("userId") as ObjectId;

        files
          ? photo = await this.helper.writeUserPicFile(
            files,
            fields.firstname,
            fields.lastname,
          )
          : null;

        const updatedData = await this.removeEmptyFields(fields);
        photo ? updatedData.photo = photo : null;

        const isUserUpdate = await this.updateToDB(
          userId,
          updatedData,
          "users",
        );

        if (isUserUpdate) {
          if (fields.firstname) {
            ctx.state.session.set("userFirstname", fields.firstname);
          }

          ctx.state.session.set("userEmail", fields.email);
          ctx.state.session.flash(
            "message",
            this.sessionFlashMsg(fields.email),
          );

          this.response(
            ctx,
            { message: this.messageToUser(isUserUpdate) },
            201,
          );
        } else {
          this.response(
            ctx,
            { message: this.messageToUser(isUserUpdate) },
            200,
          );
        }
      },
    );
  }

  private deleteProfil() {
    this.router?.delete(
      "/profil",
      async (ctx: RouterContextAppType<"/profil">) => {
        const userId = await ctx.state.session.get("userId") as ObjectId;
        const result = await this.deleteFromDB(userId, "users");
        const isUserDelete = result === 1;

        if (isUserDelete) await ctx.state.session.deleteSession();

        this.response(
          ctx,
          {
            message: this.messageToUser(
              isUserDelete ? true : false,
              "compte",
              "supprimé",
            ),
          },
          200,
        );
      },
    );
  }

  private async removeEmptyFields(
    fields: Record<string, string>,
  ) {
    const trustData = Object.keys(fields)
      .filter((key) => fields[key] !== "")
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

  private messageToUser = (
    bool: boolean,
    profilOrAccountStr = "profil",
    updateOrDeleteStr = "mis à jour",
  ) => (
    `Votre ${profilOrAccountStr} ${
      bool ? "a bien" : "n'a pas"
    } été ${updateOrDeleteStr}.`
  );
}
