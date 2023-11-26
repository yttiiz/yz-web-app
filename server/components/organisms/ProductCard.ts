// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper, Rate } from "@utils";
import { StarSvg, PicturesSlider, ShareSvg } from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

export const ProductCard: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "ProductCard",
  html: (product: ProductSchemaWithIDType) => {
    return `
      <li>
        <div>
          <header>
            <div>
              <figure>
                <img
                  src="${product.thumbnail.src}"
                  alt="${product.thumbnail.alt}"
                />
              </figure>
            </div>
            <div>
              <div>
                <h3>Aka ${product.name}</h3>
                <h4>${product.details.type}</h4>
              </div>
              <span>
                <strong>${Helper.formatPrice(product.details.price)}</strong>/jour
              </span>
            </div>
          </header>
          ${
            PicturesSlider.html(
              product._id.toString(),
              product.pictures,
            )
          }
          <div>
            <p>${product.description}</p>
            <div>
              <div class="social-btns">
                <button
                  type="button"
                  data-button="${Rate.average(product.rate)}"
                  title="notez-le !"
                >
                  ${StarSvg.html}
                </button>
                <button
                  type="button"
                  title="partagez-le !"
                >
                  ${ShareSvg.html}
                </button>
              </div>
              <a
                class="show-product"
                href="/product/${product._id.toString()}"
              >
                Découvrir
              </a>
            </div>
          </div>
        </div>
      </li>`;
  },
};
