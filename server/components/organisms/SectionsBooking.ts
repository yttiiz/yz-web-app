// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { Helper } from "@utils";
import { Dialog, BookingCard } from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  DialogDataType,
  BookingDataType,
 } from "../mod.ts";
 import { BookingUserInfoType } from "@mongo";

 const {
  title,
  description,
  card,
 }: BookingDataType = await Helper.convertJsonToObject(
  "/server/data/booking/booking.json",
 );

export const SectionsBooking: ComponentType<
 OrganismNameType,
 (...args: any[]) => string
> = {
  name: "SectionsBooking",
  html: (bookingsUserInfo: BookingUserInfoType[]) => {
    return `
    <section>
      <div class="container">
        <div>
          <h1>${title}</h1>
          <p>${description} ${new Date().getFullYear()}.</p>
        </div>
        <div class="user-bookings">
          <ul>
          ${bookingsUserInfo.map(
            bookingUserInfo => (
              `<li>
                ${BookingCard.html(
                  card,
                  bookingUserInfo,
                )}
              </li>`
            )
          ).join("")}
          </ul>
        </div>
      </div>
    </section>
    <section>
    </section>
    ${Dialog.html({})}`;
  }
}