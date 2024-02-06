import { DefaultController } from "./DefaultController.ts";
import { dynamicRoutes } from "@dynamic-routes";
import {
  LogController,
  type RouterAppType,
  type RouterContextAppType,
  type SelectUserFromDBType,
  type GetCollectionType,
  type SessionType,
  type ProductAdminFormDataType,
  type UpdateToDBType,
} from "./mod.ts";
import { ObjectId } from "@deps";
import { FormDataAppType, Validator } from "@utils";
import { FormDataType } from "@components";
import { ProductSchemaType } from "@/server/mongo/types.ts";
import {
  BookingsProductSchemaWithOptionalFieldsType,
  ProductSchemaWithOptionalFieldsType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";

export class AdminController extends DefaultController {
  public collection;
  public selectFromDB;
  private updateToDB;
  private log;

  constructor(
    router: RouterAppType,
    collection: GetCollectionType,
    selectFromDB: SelectUserFromDBType,
    updateToDB: UpdateToDBType<
      | UserSchemaWithOptionalFieldsType
      | ProductSchemaWithOptionalFieldsType
      | BookingsProductSchemaWithOptionalFieldsType
    >,
  ) {
    super(router);
    this.collection = collection;
    this.selectFromDB = selectFromDB;
    this.updateToDB = updateToDB;
    this.log = new LogController(this);
    this.getAdmin();
    this.postAdmin();
    this.postAdminLogout();
    this.putUser();
    this.putProduct();
  }

  private getAdmin() {
    this.router?.get(
      "/admin",
      async (ctx: RouterContextAppType<"/admin">) => {
        try {
          const session: SessionType = ctx.state.session;
          const isUserConnected = session.has("userId");
          const userEmail = session.get("userEmail");
          const user = await this.selectFromDB("users", userEmail, "email");
          
          if ("message" in user) {
            return this.response(ctx, "", 302, "/");
            
          } else if (user.role !== "admin") {
            return this.response(ctx, "", 302, "/");
          }

          const users = await this.collection("users");
        
          if ("message" in users) {
            return this.response(ctx, "", 302, "/");
          }

          const body = await this.createHtmlFile(
            ctx,
            {
              id: "data-admin",
              css: "admin",
              title: isUserConnected
              ? "bienvenue sur la plateforme d'admin"
              : "connexion à l'admin"
            }
          );

          this.response(
            ctx,
            body,
            200,
          );

        } catch (error) {
          this.helper.writeLog(error);
        }
      }
    );
  }

  private postAdmin() {
    this.router?.post(
      "/admin",
      this.log.loginHandler,
    );
  }

  private postAdminLogout() {
    this.router?.post(
      "/admin-logout",
      this.log.logoutHandler,
    );
  }

  private putUser() {
    const userRoute = `/${dynamicRoutes.get("user")}:id`; // "/user/:id"
    
    this.router?.put(
      userRoute,
      async (ctx: RouterContextAppType<typeof userRoute>) => {
        try {
          const _id = new ObjectId(ctx.params.id);
          const formData = await ctx.request.body.formData();
          const dataModel = await this.helper.convertJsonToObject(
            "/server/data/admin/user-form.json",
          ) as FormDataType;
          
          const dataParsed = Validator.dataParser(
            formData,
            dataModel,
          );

          if (!dataParsed.isOk) {
            return this.response(
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
            dataParsed.data["photo"] = this.defaultImg;
          }

          // Remove 'delePicture' cause is unnecessary at this step.
          delete dataParsed.data["deletePicture"];

          const {
            firstname,
            lastname
          } = dataParsed.data as Pick<
            FormDataAppType,
            "firstname" | "lastname"
          >;

          const isUpdate = await this.updateToDB(
            _id,
            dataParsed.data,
            "users",
          );

          return this.response(
            ctx, 
            {
              title: "Modification utilisateur",
              message: this.msgToAdmin`Le profil de ${
                firstname + " " + lastname
              } ${isUpdate} été`,
            },
            200,
          );
            
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    );
  }

  private putProduct() {
    const productRoute = `/${dynamicRoutes.get("product")}:id`; // "/product/:id"

    this.router?.put(
      productRoute,
      async (ctx: RouterContextAppType<typeof productRoute>) => {
        try {
          const _id = new ObjectId(ctx.params.id);
          const formData = await ctx.request.body.formData();
          const dataModel = await this.helper.convertJsonToObject(
            "/server/data/admin/product-form.json",
          ) as FormDataType;

          // Add additional types to check in 'dataModel'.
          const files = [{
            "type": "file",
            "name": "thumbnail",
            "accept": ".png, .jpg, .webp, .jpeg",
          },
          {
            "type": "file",
            "name": "pictures",
            "accept": ".png, .jpg, .webp, .jpeg",
          }];

          for (const file of files) {
            dataModel.content.push(file);
          }

          const dataParsed = Validator.dataParser(
            formData,
            dataModel,
          );

          if (!dataParsed.isOk) {
            return this.response(
              ctx,
              {
                title: "Modification non effectuée",
                message: dataParsed.message,
              },
              401,
            );
          }

          const {
            name,
            type,
            area,
            rooms,
            price,
            description,
            thumbnail,
            pictures,
          } = dataParsed.data as ProductAdminFormDataType;
          
          // Convert to object to 'Product' document. 
          const document: Partial<
            Omit<ProductSchemaType, "reviewId" | "bookingId">
          > = {
            name,
            description,
            details: {
              rooms: +rooms,
              area: +area,
              price: this.convertToNumber(price),
              type,
            },
          };

          if (thumbnail) {
            const alt = `image principale ${name}`;
            const src = await this.helper.writePicFile(
              thumbnail, 
              alt.replaceAll(" ", '_'),
            );

            document["thumbnail"] = { src, alt };
          }

          if (pictures) {
            // TODO implements logic here.
          }

          const isUpdate = await this.updateToDB(
            _id,
            document,
            "products",
          );
          
          return this.response(
            ctx,
            {
              title: "Modification appartement",
              message: this.msgToAdmin`L'appartement ${
                name as string
              } ${isUpdate} été`,
            },
            200,
          );

        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    );
  }

  private convertToNumber = (str: string) => {
    return str.includes(",")
      ? str.split(",")
        .reduce((num, chunk, i) => {
          i === 0
            ? num += +chunk
            : num += (+chunk / (Math.pow(10, chunk.length)));
          return num;
        }, 0)
      : +str;
  };

  private msgToAdmin = (
    str: TemplateStringsArray,
    name: string,
    isUpdate: boolean,
    updateOrDeleteStr?: string,
  ) => (
    `${str[0]}${name}${str[1]}${
      isUpdate ? "a bien" : "n'a pas"
    }${str[2]} ${
      updateOrDeleteStr ? updateOrDeleteStr : "mis à jour"}.`
  );
}