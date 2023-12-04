// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper, Rate } from "@utils";
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
  FormReview,
  ProductFigure,
} from "../mod.ts";

const {
  images,
  description,
  booking,
  reviewsAndRate,
  conditions,
  reviewForm,
}: ProductDataType = await Helper.convertJsonToObject(
  "/server/data/product/product.json",
);

export const SectionsProduct: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "SectionsProduct",
  html: (
    {
      product,
      reviews
    }: ProductAndReviewsType,
    isUserConnected: boolean,
  ) => {
    return `
    <section>
      <div class="container">
        <div>
          <h1>Aka ${product.name}</h1>
          <p>${product.description}</p>
        </div>
        <div class="product">
          ${ProductFigure.html(
            product,
            images.legend,
            Rate.average(product.rate),
          )}
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
            <div class="form-review">
              ${FormReview.html(reviewForm, isUserConnected)}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container conditions">
        <h1>${conditions.title}</h1>
        <p>${conditions.content}</p>
      </div>
    </section>`;
  },
};
