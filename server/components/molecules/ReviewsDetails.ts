// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import {
  RateStars,
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";
import { RateProductEnum, ReviewsProductSchemaWithIDType } from "@mongo";

export const ReviewsDetails: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "ReviewsDetails",
  html: (
    reviews: ReviewsProductSchemaWithIDType,
    reviewsTitle: string,
    reviewsEmpty: string,
  ) => (
    `
    <h3>${reviewsTitle}</h3>
    ${reviews.reviews.length > 0
      ?
      (
        `
        <dl>
        ${reviews.reviews
          .map(({
            userName,
            comment,
            timestamp,
            rate,
          }) => (
            `<dt>
              ${userName}
            </dt>
            <dd>
              <p>${comment}</p>
              <p>écrit le ${Helper.displayDate({ date: timestamp })}</p>
              <div>
                <span>
                  a noté : <strong>${rate}/${RateProductEnum.excellent}</strong>
                </span>
                ${RateStars.html(rate)}
              </div>
            </dd>
            `
          ))
          .join("")
        }
        </dl>`
      )
      :
      (
        `<p>${reviewsEmpty}</p>`
      )
    }
    `
  ),
};
