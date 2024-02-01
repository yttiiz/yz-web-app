// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
  type ComponentType,
  type MoleculeNameType,
  type FormDataType,
  InputsForm,
} from "../mod.ts";

export const DialogForm: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "DialogForm",
  html: (
    {
      action,
      method,
      content,
    }: FormDataType,
  ) => {
    return `
    <form
      action="${action}"
      method="${method}"
      type="multipart/form-data"
      data-style="user-${action.replace("/", "")}"
    >
      ${InputsForm.html({ content })}
      <span class="none"></span>
    </form>
    `
  },
};
