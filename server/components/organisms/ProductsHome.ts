// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper, Rate } from "@utils";
import { StarSvg, PicturesSlider, ShareSvg } from "../mod.ts";
import type {
  ComponentType,
  HomePageDataType,
  OrganismNameType,
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

export const ProductsHome: ComponentType<
  OrganismNameType,
  (...args: any[]) => Promise<string>
> = {
  name: "ProductsHome",
  html: async (products: Record<string, ProductSchemaWithIDType>) => {
    const {
      title,
      paragraph,
    }: HomePageDataType = await Helper.convertJsonToObject(
      `/server/data/home/home.json`,
    );

    return `
    <section>
      <div>
        <h1>${title}</h1>
        <p>${paragraph}</p>
      </div>
      <ul class="products">
      ${
      Object.keys(products)
        .map((key) => (
          `
            <li>
              <div>
                <header>
                  <div>
                    <figure>
                      <img
                        src="${products[key].thumbnail.src}"
                        alt="${products[key].thumbnail.alt}"
                      />
                    </figure>
                  </div>
                  <div>
                    <div>
                      <h3>Aka ${products[key].name}</h3>
                      <h4>${products[key].details.type}</h4>
                    </div>
                    <span>
                      <strong>
                        ${Helper.formatPrice(products[key].details.price)}
                      </strong>/jour
                    </span>
                  </div>
                </header>
                ${
                  PicturesSlider.html(
                    products[key]._id.toString(),
                    products[key].pictures,
                  )
                }
                <div>
                  <p>${products[key].description}</p>
                  <div>
                    <div class="social-btns">
                      <button
                        type="button"
                        data-button="${Rate.average(products[key].rate)}"
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
                      href="/product/${products[key]._id.toString()}"
                    >
                      Voir plus
                    </a>
                  </div>
                </div>
              </div>
            </li>
            `
        ))
        .join("")
    }
      </ul>
    </section>`;
  },
};
