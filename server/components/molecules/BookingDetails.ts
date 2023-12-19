// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { BookingsType, DetailsProductType } from "@mongo";
import { Handler, Helper } from "@utils";

export const BookingDetails: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "BookingDetails",
  html: (
    details: DetailsProductType,
    lastBooking: BookingsType,
  ) => {
    const {
      isAvailable,
      endingDate
    } = Handler.getProductAvailability(lastBooking);
    
    return `
    <div>
      <span> 
        <strong>
          ${Helper.formatPrice(details.price)}
        </strong>
        la nuit
      </span>
      <span
        data-available="${isAvailable}"
      >
        <span>
        </span>
        <strong>
        ${
          isAvailable
          ? "disponible"
          : `disponible à partir du ${Helper.displayDate(
            endingDate,
            "short"
          )}`
        }
        </strong>
      </span>
    </div>
    `
  },
};
