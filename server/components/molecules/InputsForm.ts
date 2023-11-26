// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { EyeOpenSvg, EyeShutSvg } from "../mod.ts";
import { Validator } from "@utils";
import type {
  ComponentType,
  InputDataType,
  MoleculeNameType
} from "../mod.ts";

export const InputsForm: ComponentType<
  MoleculeNameType, 
  (...args: any[]) => string
> = {
  name: "InputsForm",
  html: (
    content: InputDataType[],
    isProfilInputs: true | false = true
  ) => {
    return content
    .map(({ 
      type,
      label,
      name,
      placeholder,
      required,
      minLength,
      maxLength,
      value,
      autocomplete,
    }) => type !== "submit"
    ? (
      `<label>
        <span>${label}</span>
        <input type="${type}"
          ${name ? ` name="${name}"` : ""}
          ${placeholder ? ` placeholder="${placeholder}"` : ""}
          ${required ? ` required` : ""}
          ${minLength ? ` minLength="${minLength}"` : ""}
          ${maxLength ? ` maxLength="${maxLength}"` : ""}
          ${value ? ` value="${value}"` : ""}
          ${autocomplete ? ` autocomplete="${autocomplete}"` : ""}
          ${type === "date"
            ? Validator.minAndMaxDateParser(label as string)
            : ""}
        >
        ${type === "password"
          ? (
            `<div id="eye-password">
                <span>
                  ${EyeShutSvg.html}
                </span>
                <span class="none">
                  ${EyeOpenSvg.html}
                </span>
              </div>`
            )
          : ""}
      </label>`
      )
    : isProfilInputs
    ? ""
    : (
      `<input type="${type}"
        ${value ? ` value="${value}"` : ""}
      >`
    ))
    .join("")
  }
}