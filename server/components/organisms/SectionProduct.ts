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

const data: ProductDataType = await Helper.convertJsonToObject(
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
            ${data.mainImageLegend}
          </figcaption>
          <div>
          </div>
        </figure>
        <div>
          <h3>${data.descriptionTitle}</h3>
          <div>
            <div class="description">
              <dl>
                <dt>Type :</dt>
                <dd>${product.type}</dd>
                <dt>Superficie :</dt>
                <dd>${product.details.area}m<sup>2</sup></dd>
                <dt>Nombre de pièces :</dt>
                <dd>${product.details.rooms}</dd>
              </dl>
            </div>
            <div class="form-booking">
              <div> 
                ${Helper.formatPrice(product.details.price)}
              </div> 
            </div>
          </div>
        </div>
      </div>
    </section>`;
  },
};
