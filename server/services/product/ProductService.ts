import {
  DefaultController,
  ProductAdminFormDataType,
  RouterContextAppType,
} from "@controllers";
import { FormDataType } from "@components";
import { Validator } from "@utils";
import { ProductSchemaType, ProductSchemaWithIDType } from "@mongo";
import { ObjectId } from "@deps";

export class ProductService {
  private default;

  constructor(defaultController: DefaultController) {
    this.default = defaultController;
  }

  postCreate = async <T extends string>(ctx: RouterContextAppType<T>) => {
    try {
      const formData = await ctx.request.body.formData();
      const dataModel = (await this.default.helper.convertJsonToObject(
        "/server/data/admin/create-product-form.json",
      )) as FormDataType;

      this.default.helper.addFileModelTo(dataModel);

      const dataParsed = Validator.dataParser(formData, dataModel);

      if (!dataParsed.isOk) {
        return this.default.response(
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
            price: this.default.helper.convertToNumber(price),
            type,
          },
          thumbnail: {
            alt,
            src: await this.default.helper.writePicFile(
              thumbnail,
              alt.replaceAll(" ", "_"),
            ),
          },
          pictures: [
            {
              alt: `${name.toLocaleLowerCase()} - ${type}, le ${
                this.default.helper.displayDate(
                  { style: "normal" },
                )
              }`,
              src: await this.default.helper.writePicFile(
                pictures,
                `${name.toLocaleLowerCase()}_${
                  Math.round(
                    (Math.random() + 1) * 1000,
                  )
                }`,
              ),
            },
          ],
        };

        // 3. Insert document in database...
        const productId = await this.default.mongo.insertIntoDB(
          productDocument,
          "products",
        );

        if (!productId.includes("failed")) {
          // 4. ...create 'review' document related to current product...
          const reviewDocument = {
            _id: new ObjectId(),
            productName: name,
            productId,
            reviews: [],
          };

          const reviewId = await this.default.mongo.insertIntoDB(
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

          const bookingId = await this.default.mongo.insertIntoDB(
            bookingDocument,
            "bookings",
          );

          const isBookingAndReviewDocumentsOk = !reviewId.includes("failed") &&
            !bookingId.includes("failed");

          // 6. ...finally set 'bookingId' & 'reviewId' in product document.
          if (isBookingAndReviewDocumentsOk) {
            const newProductDocument: Partial<ProductSchemaWithIDType> = {
              ...productDocument,
            };

            newProductDocument["reviewId"] = reviewId;
            newProductDocument["bookingId"] = bookingId;

            isAllDocumentsInsertCorrectly = await this.default.mongo.updateToDB(
              new ObjectId(productId),
              newProductDocument,
              "products",
            );
          } else isAllDocumentsInsertCorrectly = false;
        } else isAllDocumentsInsertCorrectly = false;

        isAllDocumentsInsertCorrectly
          ? this.default.response(
            ctx,
            {
              title,
              message: this.default.helper
                .msgToAdmin`L'appartement ${name} ${true} été${"add"}`,
            },
            200,
          )
          : this.default.response(
            ctx,
            {
              title,
              message: this.default.helper
                .msgToAdmin`L'appartement ${name} ${false} été${"add"}`,
            },
            200,
          );
      } else {
        this.default.response(
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
      this.default.helper.writeLog(error);
    }
  };

  public putHandler = async <T extends string>(
    ctx: RouterContextAppType<T>,
  ) => {
    try {
      const _id = new ObjectId(ctx.params.id);
      const formData = await ctx.request.body.formData();
      const dataModel = (await this.default.helper.convertJsonToObject(
        "/server/data/admin/product-form.json",
      )) as FormDataType;

      this.default.helper.addFileModelTo(dataModel);

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
          price: this.default.helper.convertToNumber(price),
          type,
        },
      };

      if (thumbnail) {
        const alt = `image principale ${name}`;
        const src = await this.default.helper.writePicFile(
          thumbnail,
          alt.replaceAll(" ", "_"),
        );

        document["thumbnail"] = { src, alt };
      }

      const isUpdate = await this.default.mongo.updateToDB(
        _id,
        document,
        "products",
      );

      let isPictureUpdate = true;

      if (pictures) {
        const alt = `${name} - ${type}, le ${
          this.default.helper.displayDate({
            style: "normal",
          })
        }`;
        const src = await this.default.helper.writePicFile(
          pictures,
          `${name}_${Math.round((Math.random() + 1) * 1000)}`,
        );

        isPictureUpdate = await this.default.mongo.addNewItemIntoDB(
          _id,
          { src, alt },
          "products",
          "pictures",
        );
      }

      return this.default.response(
        ctx,
        {
          title: "Modification appartement",
          message: this.default.helper
            .msgToAdmin`L'appartement ${name as string} ${
            isUpdate && isPictureUpdate
          } été${"update"}`,
        },
        200,
      );
    } catch (error) {
      this.default.helper.writeLog(error);
    }
  };
}
