import {
  AdminController,
  DeleteItemParameterType,
  PathAppType,
  RouterContextAppType,
  SessionType,
} from "@controllers";
import { Validator } from "@utils";
import { FormDataType } from "@components";
import {
  NotFoundMessageType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";
import { ObjectId } from "@deps";

export class AdminService {
  private default;

  constructor(defaultController: AdminController) {
    this.default = defaultController;
  }

  public getAdminHandler = async <T extends PathAppType>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const session: SessionType = ctx.state.session;
      const isUserConnected = session.has("userId");
      const userEmail = session.get("userEmail");
      const user = await this.default.mongo.selectFromDB(
        "users",
        userEmail,
        "email",
      );

      if ("message" in user) {
        return this.default.response(ctx, "", 302, "/");
      } else if (isUserConnected && user.role !== "admin") {
        return this.default.response(ctx, "", 302, "/");
      }

      const users = await this.default.mongo.connectionTo("users");

      if ("message" in users) {
        return this.default.response(ctx, "", 302, "/");
      }

      const body = await this.default.createHtmlFile(ctx, {
        id: "data-admin",
        css: "admin",
        title: isUserConnected
          ? "bienvenue sur la plateforme d'admin"
          : "connexion à l'admin",
      });

      this.default.response(ctx, body, 200);
    } catch (error) {
      this.default.helper.writeLog(error);
    }
  };

  public putUserHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const _id = new ObjectId(ctx.params.id);
      const formData = await ctx.request.body.formData();
      const dataModel = (await this.default.helper.convertJsonToObject(
        "/server/data/admin/user-form.json",
      )) as FormDataType;

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
          ctx,
          {
            title: "Modification non effectuée",
            message: dataParsed.message,
          },
          401,
        );
      }

      // Check to remove user photo.
      if (dataParsed.data["deletePicture"] === "oui") {
        dataParsed.data["photo"] = this.default.defaultImg;
      }

      // Remove 'delePicture' cause is unnecessary at this step.
      delete dataParsed.data["deletePicture"];

      const user: UserSchemaWithIDType | NotFoundMessageType = await this
        .default.mongo.selectFromDB("users", _id);

      if (!("_id" in user)) {
        return this.default.response(
          ctx,
          {
            title: "Erreur serveur",
            message:
              "Le serveur ne répond pas. Veuillez réessayer ultérieurement !",
          },
          200,
        );
      }

      const updatedData = await this.default.helper
        .removeEmptyOrUnchangedFields(
          dataParsed.data,
          user,
        );

      const data: UserSchemaWithOptionalFieldsType = { ...updatedData };
      const isUpdate = await this.default.mongo.updateToDB(_id, data, "users");

      return this.default.response(
        ctx,
        {
          title: "Modification utilisateur",
          message: this.default.helper.msgToAdmin`Le profil de ${
            user.firstname + " " + user.lastname
          } ${isUpdate} été${"update"}`,
        },
        200,
      );
    } catch (error) {
      this.default.helper.writeLog(error);
    }
  };

  public deleteItem = async <T extends string>({
    ctx,
    collection,
    identifier,
  }: DeleteItemParameterType<T>) => {
    let itemName = "";
    const formData = await ctx.request.body.formData();

    // Set item name
    (formData.get("itemName") as string).includes("_")
      ? (itemName = (formData.get("itemName") as string).split("_").join(" "))
      : (itemName = formData.get("itemName") as string);

    if (collection === "bookings" || collection === "reviews") {
      const bookingToDelete = {
        userId: formData.get("userId"),
        userName: itemName,
        startingDate: formData.get("startingDate"),
        endingDate: formData.get("endingDate"),
        createdAt: +(formData.get("createdAt") as string),
      };

      const isItemDelete = await this.default.mongo.removeItemFromDB(
        new ObjectId(formData.get("id") as string),
        bookingToDelete,
        collection,
        collection,
      );

      return this.default.response(
        ctx,
        {
          message: this.default.helper
            .msgToAdmin`${`${identifier} ${itemName}`} ${isItemDelete} été${"delete"}`,
        },
        200,
      );
    } else {
      const result = await this.default.mongo.deleteFromDB(
        new ObjectId(formData.get("id") as string),
        collection,
      );

      const isItemDelete = result === 1;

      return this.default.response(
        ctx,
        {
          message: this.default.helper
            .msgToAdmin`${`${identifier} ${itemName}`} ${isItemDelete} été${"delete"}`,
        },
        200,
      );
    }
  };
}
