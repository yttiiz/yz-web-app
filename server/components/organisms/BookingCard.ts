// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { Handler, Helper } from "@utils";
import {
StarSvg,
  type BookingCardDataType,
  type ComponentType,
  type OrganismNameType,
 } from "../mod.ts";
 import { BookingUserInfoType } from "@mongo";

 export const BookingCard: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "BookingCard",
  html: ({
    createdAtTitle,
    periodTitle,
    details: {
      type,
      area,
      rooms,
    },
    amount,
  }: BookingCardDataType,
  {
    productName,
    startingDate,
    endingDate,
    details,
    thumbnail,
    rates,
  }: BookingUserInfoType) => {
    return `
    <div class="booking-card">
      <header>
        <div>
          <h4>${createdAtTitle}</h4>
          <p>10/10/2023</p>
        </div>
        <div>
          <h4>${periodTitle}</h4>
          <p>${
            Helper.displayDate(
              new Date(startingDate),
              "base",
            )} au ${
            Helper.displayDate(
              new Date(endingDate),
              "base",
          )}</p>
        </div>
      </header>
      <div class="card-content">
        <figure>
          <img src="${thumbnail.src}" alt="${thumbnail.alt}" />
          <figcaption>
            <h3>Aka ${productName}</h3>
            <span data-rate="${Handler.rateAverage(rates)}">${StarSvg.html}</span>
            <ul>
              <li>${type} ${details.type}</li>
              <li>${area} ${details.area}m<sup>2</sup></li>
              <li>${rooms} ${details.rooms}</li>
            </ul>
            <p><strong>${Helper.formatPrice(details.price)}</strong> la nuit</p>
          </figcaption>
        </figure>
        <div>
          <h4>${amount.toLocaleUpperCase()}</h4>
          <p>pour 
            <strong>
              ${Handler.getDaysNumber(
                startingDate,
                endingDate
              )} nuit${Handler.getDaysNumber(
                startingDate,
                endingDate
              ) > 1 ? "s" : ""}
            </strong> à ${Helper.formatPrice(details.price)}
          </p>
          <span>
            ${Helper.formatPrice(
              details.price * Handler.getDaysNumber(startingDate, endingDate),
            )}
          </span>
        </div>
      </div>
    </div>
    `;
  }
}