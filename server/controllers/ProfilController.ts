import { ObjectId } from "@deps";
import { DefaultController } from "./DefaultController.ts";
import type { RouterAppType, RouterContextAppType } from "./mod.ts";
import { SessionType } from "@/server/controllers/types.ts";
import { FormDataAppType, Validator } from "@utils";
import { UserSchemaWithIDType } from "@mongo";

export class ProfilController extends DefaultController {
  constructor(router: RouterAppType) {
    super(router);
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
          accept: ".png, .jpg, .webp, .jpeg",
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

        const user = await this.mongo.selectFromDB<UserSchemaWithIDType>(
          "users",
          userId,
        );

        if (!("_id" in user)) {
          return this.response(
            ctx,
            { message: this.messageToUser(false) },
            200,
          );
        }

        const updatedData = await this.helper.removeEmptyOrUnchangedFields(
          dataParsed.data,
          user,
          picPath,
        );

        const isUserUpdate = await this.mongo.updateToDB(
          userId,
          updatedData,
          "users",
        );

        if (isUserUpdate || isNewPhoto) {
          if (updatedData.firstname) {
            session.set("userFirstname", updatedData.firstname);

            const oldFullname = session.get("userFullname");
            const newFullname = `${updatedData.firstname} ${
              oldFullname.split(" ")[1]
            }`;

            session.set("userFullname", newFullname);
          }

          if (updatedData.lastname && !updatedData.firstname) {
            const oldFullname = session.get("userFullname");
            const newFullname = `${
              oldFullname.split(" ")[0]
            } ${updatedData.lastname}`;

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
            { message: this.messageToUser(isUserUpdate), picPath },
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
        const result = await this.mongo.deleteFromDB(userId, "users");
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
