import { ObjectId } from "@deps";
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
import { FormDataAppType, Validator } from "@utils";

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
        let picPath = "", isNewPhoto = true;

        const session: SessionType = ctx.state.session;
        const dataModel = await this.helper.convertJsonToObject(
          `/server/data/profil/profil.json`,
        );

        // Add file model.
        dataModel.content.push({
          type: "file",
          name: "photo",
          accept: ".png, .jpg, .webp, .jpeg"
        });

        const formData = await ctx.request.body.formData();
        const dataParsed = Validator.dataParser(formData, dataModel);
    
        if (!dataParsed.isOk) {
          return this.response(
            ctx,
            { message: dataParsed.message },
            200,
          );
        }

        const {
          lastname,
          firstname,
          photo,
        } = dataParsed.data as Pick<
          FormDataAppType,
          "lastname" | "firstname" | "photo"
        >;
        
        const userId = session.get("userId");
        
        photo
          ? picPath = await this.helper.writeUserPicFile(
            photo,
            firstname,
            lastname,
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

        const updatedData = await this.removeEmptyOrUnchangedFields(
          dataParsed.data,
          user,
          picPath,
        );

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

          if (picPath) {
            session.set("userPhoto", picPath);
          }

          if (updatedData.email) {
            session.set("userEmail", updatedData.email);
            session.flash(
              "message",
              this.sessionFlashMsg(updatedData.email),
            );
          }

          this.response(
            ctx,
            { message: this.messageToUser(isUserUpdate),
              picPath,
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
              isUserDelete,
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
    data: Record<string, FormDataEntryValue>,
    user: UserSchemaWithIDType,
    picPath: string | undefined,
  ) {

    const trustData = Object.keys(data)
      .filter((key) => data[key] !== "" || data[key] !== undefined)
      .reduce((acc, key) => {

        if (data[key] instanceof File) {
          delete data[key];
          
          return acc;

        } else {
          if (user[key as keyof typeof user] !== data[key]) {
            key === "birth"
              ? acc["birth"] = new Date(data[key] as string)
              : acc[key as keyof Omit<typeof acc, "birth">] = data[key] as string;
    
            return acc;
          }

          return acc;
        }
      }, {} as UserSchemaWithOptionalFieldsType & { password?: string });

    if (trustData["password"]) {
      trustData["hash"] = await Auth.hashPassword(trustData["password"]);
      delete trustData["password"];
    }

    if (picPath) {
      trustData["photo"] = picPath;
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
