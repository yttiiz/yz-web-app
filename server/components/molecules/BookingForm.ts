// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { DetailsProductType } from "@mongo";
import { FormDataType, InputsForm } from "../mod.ts";
import { Helper } from "@utils";

export const BookingForm: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "BookingForm",
  html: (
    details: DetailsProductType,
    form: FormDataType,
  ) => (
    `
    <div>
      <h3>${form.title}</h3>
      <form
        action="${form.action}"
        method="${form.method}"
        data-style="booking"
      >
        ${InputsForm.html(form.content, false)}
      </form>
    </div>
    `
  ),
};
