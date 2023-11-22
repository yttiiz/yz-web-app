// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper, Rate } from "@utils";
import { StarSvg, PicturesSlider, ShareSvg } from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  ProductDataType,
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";
import { BookingDetails, BookingForm } from "@components";

const {
  mainImageLegend,
  descriptionTitle,
  descriptionInfo,
  bookingForm,
}: ProductDataType = await Helper.convertJsonToObject(
  "/server/data/product/product.json",
);
export const SectionProduct: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "SectionProduct",
  html: (product: ProductSchemaWithIDType) => {

    console.log(bookingForm)

    return `
    <section>
      <div>
        <h1>Aka ${product.name}</h1>
        <p>${product.description}</p>
      </div>
      <div class="product">
        <figure>
          <img
            src="${product.pictures.at(0)?.src}"
            alt="${product.pictures.at(0)?.alt}"
          />
          <figcaption>
            ${mainImageLegend}
          </figcaption>
          <div>
          </div>
        </figure>
        <div>
          <div class="booking">
            ${BookingDetails.html(product.details)}
            ${BookingForm.html(product.details, bookingForm)}
          </div>
          <h3>${descriptionTitle}</h3>
          <div class="description">
            <ul>
            ${Object.keys(descriptionInfo)
              .map(key => (
                `<li>
                  <b>${descriptionInfo[key as keyof typeof descriptionInfo]} :</b> 
                  ${key === "area"
                    ? `${product.details[key as keyof typeof product.details]}m<sup>2</sup>`
                    : product.details[key as keyof typeof product.details]
                  }
                </li>`
              ))
              .join("")
            }
            </ul>
          </div>
        </div>
      </div>
    </section>`;
  },
};
