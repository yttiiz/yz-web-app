// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import { LikeSvg, ShareSvg } from "../mod.ts";
import type {
  ComponentType, HomePageDataType, OrganismNameType } from "../mod.ts";
import { ProductSchemaType } from "@mongo";

export const ProductsHome: ComponentType<
  OrganismNameType,
  (...args: any[]) => Promise<string>
> = {
  name: "ProductsHome",
  html: async (products: Record<string, ProductSchemaType>) => {
    const {
      title,
      paragraph,
    }: HomePageDataType = await Helper.convertJsonToObject(
      `/server/data/home/home.json`,
    );

    console.log(products)

    return `
    <section>
      <h1>${title}</h1>
      <p>${paragraph}</p>
      <ul class="products">
        ${
          Object.keys(products)
          .map(key => (
            `
            <li>
              <div>
                <header>
                  <div>
                    <figure>
                      <img src="${products[key].thumbnail}" alt="image1">
                    </figure>
                    <div>
                      <h3>Aka ${products[key].name}</h3>
                      <h4>${products[key].type}</h4>
                    </div>
                  </div>
                  <div>
                    <span>
                      <strong>
                        ${Helper.formatPrice(products[key].price)}
                      </strong>/jour
                    </span>
                  </div>
                </header>
                <div>
                  <figure>
                    <img src="${products[key].pictures.at(0)}" alt="image3">
                  </figure>
                </div>
                <div>
                  <p>${products[key].description}</p>
                  <div>
                    <div class="social-btns">
                      <button
                        type="button"
                        data-button="like"
                        title="j'aime"
                      >
                        ${LikeSvg.html}
                      </button>
                      <button
                        type="button"
                        data-button="share"
                        title="je partage"
                      >
                        ${ShareSvg.html}
                      </button>
                    </div>
                    <a href="/product">Voir plus</a>
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
