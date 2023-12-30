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
  html: () => {
    return `
    <section>
      <div class="container">
        <div>
          <h1>${title}</h1>
          <p>${description} ${new Date().getFullYear()}.</p>
        </div>
        <div class="user-bookings">
          ${BookingCard.html(
            card,
          )}
        </div>
      </div>
    </section>
    <section>
    </section>
    ${Dialog.html({})}`;
  }
}