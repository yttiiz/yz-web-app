// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { DetailsProductType } from "@mongo";
import { Helper } from "@utils";

export const BookingDetails: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "BookingDetails",
  html: (details: DetailsProductType) => (
    `
    <div>
      <span> 
        <strong>
          ${Helper.formatPrice(details.price)}
        </strong>
        la nuit
      </span>
      <span
        data-available="${details.available}"
      >
        <span>
        </span>
        <strong>
        ${
          details.available
          ? "disponible"
          : "non disponible"
        }
        </strong>
      </span>
    </div>
    `
  ),
};
