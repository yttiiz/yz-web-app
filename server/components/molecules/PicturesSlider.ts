// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { ImagesProductType } from "@mongo";

export const PicturesSlider: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "PicturesSlider",
  html: (pictures: ImagesProductType[]) => (
    `
    <div data-slider-length="${pictures.length}">
      <a
        href="/product"
        class="slider-product"
        style="width: ${100 * pictures.length}%;"
      >
      ${pictures
        .map((picture) => (
          `<figure>
            <img
              src="${picture.src}"
              alt="${picture.alt}"
            />
          </figure>`
        ))
        .join("")
      }
      </a>
      <button type="button" class="hidden">
        <span></span>
      </button>
      <button type="button">
        <span></span>
      </button>
      <ul class="slider-product-nav-landmarks"></ul>
    </div>
    `
  )
  ,
};
