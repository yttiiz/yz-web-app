// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper, Handler } from "@utils";
import type {
  ComponentType,
  DialogDataType,
  OrganismNameType,
  ProductDataType,
} from "../mod.ts";
import { ProductFullDataType } from "@mongo";
import {
  BookingDetails,
  BookingForm,
  ProductDetails,
  Dialog,
  ReviewsDetails,
  FormReview,
  ProductFigure,
  LoginRegister,
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
      reviews,
      actualOrFutureBookings,
    }: ProductFullDataType,
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
            Handler.rateAverage(reviews),
          )}
          <div>
            <div class="booking">
              ${BookingDetails.html(
                product.details,
                actualOrFutureBookings.at(0),
              )}
              ${BookingForm.html(
                booking,
                isUserConnected,
                actualOrFutureBookings
                .at(0)?.endingDate,
              )}
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
            <div class="review-form">
              ${FormReview.html(
                reviewForm,
                isUserConnected
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="conditions">
          <h1>${conditions.title}</h1>
          <p>${conditions.content}</p>
        </div>
      </div>
    </section>
    ${Dialog.html({
      title: "",
      paragraph: "",
      component: LoginRegister.html
    } as DialogDataType)}`;
  },
};
