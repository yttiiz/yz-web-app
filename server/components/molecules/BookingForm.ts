// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";
import { FormDataType, InputsForm } from "../mod.ts";

export const BookingForm: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "BookingForm",
  html: (
    form: FormDataType,
    isUserConnected: boolean,
  ) => (
    `
    <div>
      <h3>${form.title}</h3>
      <form
        action="${form.action}"
        method="${form.method}"
        data-style="booking"
        data-user-connected="${isUserConnected}"
      >
        ${InputsForm.html(form.content, false)}
      </form>
    </div>
    `
  ),
};
