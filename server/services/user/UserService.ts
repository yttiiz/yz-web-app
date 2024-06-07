import { DefaultController, RouterContextAppType } from "@controllers";
import { ObjectId } from "@deps";
import { FormDataType } from "@components";
import { Helper, Validator } from "@utils";
import {
  Mongo,
  NotFoundMessageType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";

export class UserService {
  default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  public putHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const _id = new ObjectId(ctx.params.id);
      const formData = await ctx.request.body.formData();
      const dataModel = (await Helper.convertJsonToObject(
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

      const updatedData = await Helper
        .removeEmptyOrUnchangedFields(
          dataParsed.data,
          user,
        );

      const data: UserSchemaWithOptionalFieldsType = { ...updatedData };
      const isUpdate = await Mongo.updateToDB(_id, data, "users");

      return this.default.response(
        ctx,
        {
          title: "Modification utilisateur",
          message: Helper.msgToAdmin`Le profil de ${
            user.firstname + " " + user.lastname
          } ${isUpdate} été${"update"}`,
        },
        200,
      );
    } catch (error) {
      Helper.writeLog(error);
    }
  };

  public static getUserInfo = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    return {
      userId: (await ctx.state.session.get("userId") as ObjectId).toHexString(),
      userName: await ctx.state.session.get("userFullname") as string,
    };
  };
}
