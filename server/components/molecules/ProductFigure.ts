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
      <img
        src="${product.pictures.at(0)?.src}"
        alt="${product.pictures.at(0)?.alt}"
      />
      <figcaption>
        <span>${legend}</span>
        <span>
          ${StarSvg.html}
          <strong>${rate}</strong>
        </span>
      </figcaption>
      <div>
      </div>
    </figure>
    `
  ),
};
