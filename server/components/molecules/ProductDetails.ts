// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
  ProductDescriptionType
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

export const ProductDetails: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "ProductDetails",
  html: (
    product: ProductSchemaWithIDType,
    descriptionInfo: ProductDescriptionType,
    descriptionTitle: string
  ) => (
    `
    <h3>${descriptionTitle}</h3>
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
    `
  ),
};
