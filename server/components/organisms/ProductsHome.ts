// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import { Dialog, ProductCard, ShareForm } from "../mod.ts";
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
      <div class="container">
        <div>
          <h1>${title}</h1>
          <p>${paragraph}</p>
        </div>
        <ul class="products">
          ${Object.keys(products)
            .map((key) => ProductCard.html(products[key]))
            .join("")}
        </ul>
      </div>
    </section>
    ${Dialog.html(
      { component: ShareForm.html },
    )}`;
  },
};
