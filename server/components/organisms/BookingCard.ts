// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import {
StarSvg,
  type BookingCardDataType,
  type ComponentType,
  type OrganismNameType,
 } from "../mod.ts";


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
  }: BookingCardDataType,) => {
    return `
    <div class="booking-card">
      <header>
        <div>
          <h4>${createdAtTitle}</h4>
          <p>10/10/2023</p>
        </div>
        <div>
          <h4>${periodTitle}</h4>
          <p>15/10/2023 au 22/10/2023</p>
        </div>
      </header>
      <div class="card-content">
        <figure>
          <img src="/img/products/fixture_0003.jpg" alt="" />
          <figcaption>
            <h3>Aka Untel</h3>
            <span data-rate="4">${StarSvg.html}</span>
            <ul>
              <li>${type} F1</li>
              <li>${area} 37 m2</li>
              <li>${rooms} 2</li>
            </ul>
            <p><strong>39,99€</strong> la nuit</p>
          </figcaption>
        </figure>
        <div>
        </div>
      </div>
    </div>
    `;
  }
}