import { DefaultController } from "./DefaultController.ts";
import { dynamicRoutes } from "@dynamic-routes";
import {
  type DeleteItemParameterType,
  LogController,
  type ProductAdminFormDataType,
  type RouterAppType,
  type RouterContextAppType,
  type SessionType,
} from "./mod.ts";
import { ObjectId } from "@deps";
import { Validator } from "@utils";
import { FormDataType } from "@components";
import type {
  BookingsType,
  NotFoundMessageType,
  ProductSchemaType,
  ProductSchemaWithIDType,
  UserSchemaWithIDType,
  UserSchemaWithOptionalFieldsType,
} from "@mongo";

export class AdminController extends DefaultController {
  private log;

  constructor(router: RouterAppType) {
    super(router);
    this.log = new LogController(this);
    this.getAdmin();
    this.postAdminLogin();
    this.postAdminLogout();
    this.postCreateProduct();
    this.putUser();
    this.putProduct();
    this.putBooking();
    this.deleteUser();
    this.deleteProduct();
    this.deleteBooking();
  }

  private getAdmin() {
    this.router?.get(
      "/admin",
      async (ctx: RouterContextAppType<"/admin">) => {
        try {
          const session: SessionType = ctx.state.session;
          const isUserConnected = session.has("userId");
          const userEmail = session.get("userEmail");
          const user = await this.mongo.selectFromDB(
            "users",
            userEmail,
            "email",
          );

          if ("message" in user) {
            return this.response(ctx, "", 302, "/");
          } else if (isUserConnected && user.role !== "admin") {
            return this.response(ctx, "", 302, "/");
          }

          const users = await this.mongo.connectionTo("users");

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
                : "connexion à l'admin",
            },
          );

          this.response(
            ctx,
            body,
            200,
          );
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    );
  }

  private postAdminLogin() {
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

  private postCreateProduct() {
    this.router?.post(
      "/admin-create-product",
      async (ctx: RouterContextAppType<"/admin-create-product">) => {
        try {
          const formData = await ctx.request.body.formData();
          const dataModel = await this.helper.convertJsonToObject(
            "/server/data/admin/create-product-form.json",
          ) as FormDataType;

          this.addFileModelTo(dataModel);

          const dataParsed = Validator.dataParser(
            formData,
            dataModel,
          );

          if (!dataParsed.isOk) {
            return this.response(
              ctx,
              {
                title: "Enregistrement non effectué",
                message: dataParsed.message,
              },
              401,
            );
          }

          // 1. Retreive all values needed.
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

          const title = "Ajout appartement";
          const alt = `image principale ${name.toLocaleLowerCase()}`;

          let isAllDocumentsInsertCorrectly = true;
          let productDocument: Omit<
            ProductSchemaWithIDType,
            "bookingId" | "reviewId"
          >;

          if (thumbnail && pictures) {
            // 2. If 'thumbnail' & 'pictures' are defined, set document.
            productDocument = {
              _id: new ObjectId(),
              name,
              description,
              details: {
                rooms: +rooms,
                area: +area,
                price: this.convertToNumber(price),
                type,
              },
              thumbnail: {
                alt,
                src: await this.helper.writePicFile(
                  thumbnail,
                  alt.replaceAll(" ", "_"),
                ),
              },
              pictures: [
                {
                  alt: `${name.toLocaleLowerCase()} - ${type}, le ${
                    this.helper.displayDate({ style: "normal" })
                  }`,
                  src: await this.helper.writePicFile(
                    pictures,
                    `${name.toLocaleLowerCase()}_${
                      Math.round((Math.random() + 1) * 1000)
                    }`,
                  ),
                },
              ],
            };

            // 3. Insert document in database...
            const productId = await this.mongo.insertIntoDB(
              productDocument,
              "products",
            );

            if (!(productId.includes("failed"))) {
              // 4. ...create 'review' document related to current product...
              const reviewDocument = {
                _id: new ObjectId(),
                productName: name,
                productId,
                reviews: [],
              };

              const reviewId = await this.mongo.insertIntoDB(
                reviewDocument,
                "reviews",
              );

              // 5. ...and 'booking' document related to current product...
              const bookingDocument = {
                _id: new ObjectId(),
                productName: name,
                productId,
                bookings: [],
              };

              const bookingId = await this.mongo.insertIntoDB(
                bookingDocument,
                "bookings",
              );

              const isBookingAndReviewDocumentsOk =
                !(reviewId.includes("failed")) &&
                !(bookingId.includes("failed"));

              // 6. ...finally set 'bookingId' & 'reviewId' in product document.
              if (isBookingAndReviewDocumentsOk) {
                const newProductDocument: Partial<ProductSchemaWithIDType> = {
                  ...productDocument,
                };

                newProductDocument["reviewId"] = reviewId;
                newProductDocument["bookingId"] = bookingId;

                isAllDocumentsInsertCorrectly = await this.mongo.updateToDB(
                  new ObjectId(productId),
                  newProductDocument,
                  "products",
                );
              } else isAllDocumentsInsertCorrectly = false;
            } else isAllDocumentsInsertCorrectly = false;

            isAllDocumentsInsertCorrectly
              ? this.response(
                ctx,
                {
                  title,
                  message: this
                    .msgToAdmin`L'appartement ${name} ${true} été${"add"}`,
                },
                200,
              )
              : this.response(
                ctx,
                {
                  title,
                  message: this
                    .msgToAdmin`L'appartement ${name} ${false} été${"add"}`,
                },
                200,
              );
          } else {
            this.response(
              ctx,
              {
                title,
                message:
                  "Vous devez obligatoirement joindre des images pour créer un nouvel appartement.",
              },
              200,
            );
          }
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
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

          const user: UserSchemaWithIDType | NotFoundMessageType = await this
            .mongo.selectFromDB("users", _id);

          if (!("_id" in user)) {
            return this.response(
              ctx,
              {
                title: "Erreur serveur",
                message:
                  "Le serveur ne répond pas. Veuillez réessayer ultérieurement !",
              },
              200,
            );
          }

          const updatedData = await this.helper.removeEmptyOrUnchangedFields(
            dataParsed.data,
            user,
          );

          const data: UserSchemaWithOptionalFieldsType = { ...updatedData };
          const isUpdate = await this.mongo.updateToDB(
            _id,
            data,
            "users",
          );

          return this.response(
            ctx,
            {
              title: "Modification utilisateur",
              message: this.msgToAdmin`Le profil de ${
                user.firstname + " " + user.lastname
              } ${isUpdate} été${"update"}`,
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

          this.addFileModelTo(dataModel);

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

          // Convert object to 'Product' document.
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
              alt.replaceAll(" ", "_"),
            );

            document["thumbnail"] = { src, alt };
          }

          const isUpdate = await this.mongo.updateToDB(
            _id,
            document,
            "products",
          );

          let isPictureUpdate = true;

          if (pictures) {
            const alt = `${name} - ${type}, le ${
              this.helper.displayDate({ style: "normal" })
            }`;
            const src = await this.helper.writePicFile(
              pictures,
              `${name}_${Math.round((Math.random() + 1) * 1000)}`,
            );

            isPictureUpdate = await this.mongo.addNewItemIntoDB(
              _id,
              { src, alt },
              "products",
              "pictures",
            );
          }

          return this.response(
            ctx,
            {
              title: "Modification appartement",
              message: this.msgToAdmin`L'appartement ${name as string} ${
                isUpdate && isPictureUpdate
              } été${"update"}`,
            },
            200,
          );
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    );
  }

  private putBooking() {
    const bookingRoute = `/${dynamicRoutes.get("booking")}:id`; // "/booking/:id"

    this.router?.put(
      bookingRoute,
      async (ctx: RouterContextAppType<typeof bookingRoute>) => {
        try {
          const formData = await ctx.request.body.formData();
          const dataModel = await this.helper.convertJsonToObject(
            "/server/data/admin/booking-form.json",
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

          const data = dataParsed.data as unknown as BookingsType;

          // Even 'createdAt' is typed as number, it's a string.
          const itemValue = +(data.createdAt);
          data.createdAt = itemValue;

          const isUpdate = await this.mongo.updateItemIntoDB({
            data,
            collection: "bookings",
            key: "bookings",
            itemKey: "createdAt",
            itemValue,
          });

          return this.response(
            ctx,
            {
              title: "Modification réservation",
              message: this
                .msgToAdmin`La réservation de ${data.userName} ${isUpdate} été${"update"}`,
            },
            200,
          );
        } catch (error) {
          this.helper.writeLog(error);
        }
      },
    );
  }

  private deleteUser() {
    this.router?.delete(
      "/user",
      async (ctx: RouterContextAppType<"/user">) => {
        return await this.deleteItem({
          ctx,
          collection: "users",
          identifier: "L'utilisateur",
        });
      },
    );
  }

  private deleteProduct() {
    this.router?.delete(
      "/product",
      async (ctx: RouterContextAppType<"/product">) => {
        return await this.deleteItem({
          ctx,
          collection: "products",
          identifier: "L'appartement",
        });
      },
    );
  }

  private deleteBooking() {
    this.router?.delete(
      "/booking",
      async (ctx: RouterContextAppType<"/booking">) => {
        return await this.deleteItem({
          ctx,
          collection: "bookings",
          identifier: "La réservation de",
        });
      },
    );
  }

  private async deleteItem<T extends string>({
    ctx,
    collection,
    identifier,
  }: DeleteItemParameterType<T>) {
    let itemName = "";
    const formData = await ctx.request.body.formData();

    // Set item name
    (formData.get("itemName") as string).includes("_")
      ? itemName = (
        formData.get("itemName") as string
      ).split("_").join(" ")
      : itemName = formData.get("itemName") as string;

    if (collection === "bookings" || collection === "reviews") {
      const bookingToDelete = {
        userId: formData.get("userId"),
        userName: itemName,
        startingDate: formData.get("startingDate"),
        endingDate: formData.get("endingDate"),
        createdAt: +(formData.get("createdAt") as string),
      };

      const isItemDelete = await this.mongo.removeItemFromDB(
        new ObjectId(formData.get("id") as string),
        bookingToDelete,
        collection,
        collection,
      );

      return this.response(
        ctx,
        {
          message: this
            .msgToAdmin`${`${identifier} ${itemName}`} ${isItemDelete} été${"delete"}`,
        },
        200,
      );
    } else {
      const result = await this.mongo.deleteFromDB(
        new ObjectId(formData.get("id") as string),
        collection,
      );

      const isItemDelete = result === 1;

      return this.response(
        ctx,
        {
          message: this
            .msgToAdmin`${`${identifier} ${itemName}`} ${isItemDelete} été${"delete"}`,
        },
        200,
      );
    }
  }

  private addFileModelTo(dataModel: FormDataType) {
    // Add additional types to check in 'dataModel'.
    const files = [{
      "type": "file",
      "name": "thumbnail",
      "accept": ".png, .jpg, .webp, .jpeg",
    }, {
      "type": "file",
      "name": "pictures",
      "accept": ".png, .jpg, .webp, .jpeg",
    }];

    for (const file of files) {
      dataModel.content.push(file);
    }
  }

  private convertToNumber = (str: string) => {
    return str.includes(",")
      ? str.split(",")
        .reduce((num, chunk, i) => {
          i === 0
            ? num += +chunk
            : num += +chunk / (Math.pow(10, chunk.length));
          return num;
        }, 0)
      : +str;
  };

  private msgToAdmin = (
    str: TemplateStringsArray,
    name: string,
    isUpdate: boolean,
    updateOrDeleteStr?: "delete" | "update" | "add",
  ) => (
    `${str[0]}${name}${str[1]}${isUpdate ? "a bien" : "n'a pas"}${str[2]} ${
      updateOrDeleteStr === "delete"
        ? "supprimé"
        : (updateOrDeleteStr === "update" ? "mis à jour" : "ajouté")
    }.`
  );
}
