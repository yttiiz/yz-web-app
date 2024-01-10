import { oak, ObjectId } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type {
  DeleteFromDBType,
  RouterAppType,
  RouterContextAppType,
  SelectUserFromDBType,
  UpdateUserToDBType,
} from "./mod.ts";
import { Auth } from "@auth";
import type { UserSchemaWithIDType, UserSchemaWithOptionalFieldsType } from "@mongo";
import { SessionType } from "@/server/controllers/types.ts";

export class ProfilController extends DefaultController {
  private updateToDB;
  private deleteFromDB;
  private selectFromDB;

  constructor(
    router: RouterAppType,
    updateToDB: UpdateUserToDBType,
    deleteFromDB: DeleteFromDBType,
    selectFromDB: SelectUserFromDBType,
  ) {
    super(router);
    this.updateToDB = updateToDB;
    this.deleteFromDB = deleteFromDB;
    this.selectFromDB = selectFromDB;
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
        let photo = "", isNewPhoto = true;

        const session: SessionType = ctx.state.session;
        const data = await ctx.request.body().value as oak.FormDataReader;
        const { fields, files } = await data.read({ maxSize: this.MAX_SIZE });
        const userId = session.get("userId");
        
        files
          ? photo = await this.helper.writeUserPicFile(
            files,
            fields.firstname,
            fields.lastname,
          )
          : isNewPhoto = false;
        
        const user = await this.selectFromDB("users", userId);

        if (!('_id' in user)) {
          return this.response(
            ctx,
            { message: this.messageToUser(false) },
            200,
          );
        }

        const updatedData = await this.removeEmptyOrUnchangedFields(fields, user);
        photo ? updatedData.photo = photo : null;

        const isUserUpdate = await this.updateToDB(
          userId,
          updatedData,
          "users",
        );

        if (isUserUpdate || isNewPhoto) {
          
          if (updatedData.firstname) {
            session.set("userFirstname", updatedData.firstname);

            const oldFullname = session.get("userFullname");
            const newFullname = `${updatedData.firstname} ${oldFullname.split(" ")[1]}`;

            session.set("userFullname", newFullname);
          }

          if (updatedData.lastname && !updatedData.firstname) {

            const oldFullname = session.get("userFullname");
            const newFullname = `${oldFullname.split(" ")[0]} ${updatedData.lastname}`;

            session.set("userFullname", newFullname);
          }

          if (photo) {
            session.set("userPhoto", photo);
          }

          session.set("userEmail", fields.email);
          session.flash(
            "message",
            this.sessionFlashMsg(fields.email),
          );

          this.response(
            ctx,
            { message: this.messageToUser(isUserUpdate),
              photo,
            },
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

  private async removeEmptyOrUnchangedFields(
    fields: Record<string, string>,
    user: UserSchemaWithIDType,
  ) {
    const trustData = Object.keys(fields)
      .filter((key) => fields[key] !== "")
      .reduce((acc, key) => {
        if (user[key as keyof typeof user] !== fields[key]) {
          key === "birth"
            ? acc["birth"] = new Date(fields[key])
            : acc[key as keyof Omit<typeof acc, "birth">] = fields[key];
  
          return acc;
        }

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
