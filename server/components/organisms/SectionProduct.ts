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
  mainImageLegend,
  descriptionTitle,
  descriptionInfo,
  bookingForm,
  reviewsTitle,
  reviewsEmpty,
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
            ${mainImageLegend}
          </figcaption>
          <div>
          </div>
        </figure>
        <div>
          <div class="booking">
            ${BookingDetails.html(product.details)}
            ${BookingForm.html(product.details, bookingForm)}
          </div>
          <div class="description">
            ${ProductDetails.html(product, descriptionInfo, descriptionTitle)}
          </div>
          <div class="reviews">
            ${ReviewsDetails.html(reviews, reviewsTitle, reviewsEmpty)}
          </div>
        </div>
      </div>
    </section>`;
  },
};
