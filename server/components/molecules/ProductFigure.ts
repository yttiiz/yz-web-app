// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
  ComponentType,
  MoleculeNameType,
  StarSvg,
} from "../mod.ts";
import { ProductSchemaWithIDType } from "@mongo";

export const ProductFigure: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "ProductFigure",
  html: (
    product: ProductSchemaWithIDType,
    legend: string,
    rate: string
  ) => (
    `
    <figure>
      <figure
        style="width: ${product.pictures.length * 100}%;"
        class="figure-img-container"
      >
      ${product.pictures
        .map(picture => (
          `<img
            src="${picture.src}"
            alt="${picture.alt}"
          />`
        )
      ).join("")}
      </figure>
      <figcaption>
        <span>${legend}</span>
        <span>
          ${StarSvg.html}
          <strong>${rate}</strong>
        </span>
      </figcaption>
      <div class="figcaption-shadow">
      </div>
    </figure>
    `
  ),
};
