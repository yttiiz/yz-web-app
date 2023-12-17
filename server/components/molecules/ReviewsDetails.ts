// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import {
  StarSvg,
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";
import { RateProductEnum, ReviewsProductWithIDType } from "@mongo";

const displayStars = (rate: number) => {
  let stars = ""
  
  for (let i = 0; i < RateProductEnum.excellent; i++) {
    stars +=
      `<li${i + 1 <= rate ? " class=\"ranking\"": ""}>
        ${StarSvg.html}
      </li>`;
  }


  return stars;
};

export const ReviewsDetails: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "ReviewsDetails",
  html: (
    reviews: ReviewsProductWithIDType,
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
              <p>écrit le ${Helper.displayDate(timestamp)}</p>
              <div>
                <span>
                  a noté : <strong>${rate}/${RateProductEnum.excellent}</strong>
                </span>
                <ul title="${rate}/${RateProductEnum.excellent}">
                  ${displayStars(rate)}
                </ul>
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
