// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import type {
  ComponentType,
  OrganismNameType,
  ProductDataType,
} from "../mod.ts";
import { ProductAndReviewsType } from "@mongo";
import {
  BookingDetails,
  BookingForm,
  ProductDetails,
  ReviewsDetails,
} from "../mod.ts";

const {
  images,
  description,
  booking,
  reviewsAndRate,
  conditions,
}: ProductDataType = await Helper.convertJsonToObject(
  "/server/data/product/product.json",
);

export const SectionProduct: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "SectionProduct",
  html: ({product, reviews}: ProductAndReviewsType) => {
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
            ${images.legend}
          </figcaption>
          <div>
          </div>
        </figure>
        <div>
          <div class="booking">
            ${BookingDetails.html(product.details)}
            ${BookingForm.html(product.details, booking)}
          </div>
          <div class="description">
            ${ProductDetails.html(
              product,
              description.infos,
              description.title,
            )}
          </div>
          <div class="reviews">
            ${ReviewsDetails.html(
              reviews,
              reviewsAndRate.title,
              reviewsAndRate.empty,
            )}
          </div>
        </div>
      </div>
      <div class="conditions">
        <h1>${conditions.title}</h1>
        <p>${conditions.content}</p>
      </div>
    </section>`;
  },
};
