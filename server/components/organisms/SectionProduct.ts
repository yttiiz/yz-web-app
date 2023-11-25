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
import {
  BookingDetails,
  BookingForm,
  ProductDetails,
} from "@components";

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
          <div class="description">
            ${ProductDetails.html(product, descriptionInfo, descriptionTitle)}
          </div>
          <div>
            <h3>Qu'en pensent ceux qui y ont séjourné ?</h3>
          </div>
        </div>
      </div>
    </section>`;
  },
};
