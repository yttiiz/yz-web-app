// deno-fmt-ignore-file
import { Helper } from "@utils";
import { Dialog, ProductCard, ShareForm } from "../mod.ts";
import type {
  ComponentType,
  HomePageDataType,
  OrganismNameType,
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

export const SectionProductsHome: ComponentType<
  OrganismNameType,
  (products: Record<string, ProductSchemaWithIDType>) => Promise<string>
> = {
  name: "SectionProductsHome",
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
