// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { EyeOpenSvg, EyeShutSvg } from "../mod.ts";
import { Validator } from "@utils";
import type {
  ComponentType,
  InputFormPropsType,
  MoleculeNameType
} from "../mod.ts";

export const InputsForm: ComponentType<
  MoleculeNameType, 
  (...args: any[]) => string
> = {
  name: "InputsForm",
  html: ({
    content,
    isProfilInputs = false,
    date,
  }: InputFormPropsType,
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
      items,
    }) => type !== "submit" && name !== "photo"
    ? (
      `<label>
        ${type !== "radio"
          ? `<span>${label}</span>`
          : ""
        }
        ${type === "select"
        ? (
          `<select
            ${name ? ` name="${name}"` : ""}
            ${required ? ` required` : ""}
          >
            <option value=\"\">Choisir...</option>
            ${items ? (items.map(item => (
              `<option value="${item}">${item}</option>`
              )).join("")
            ) : "<option value=\"\">choisir...</option>"}
          </select>`
          )
        : (
          `<input type="${type}"
            ${name ? ` name="${name}"` : ""}
            ${placeholder ? ` placeholder="${placeholder}"` : ""}
            ${required ? ` required` : ""}
            ${minLength ? ` minLength="${minLength}"` : ""}
            ${maxLength ? ` maxLength="${maxLength}"` : ""}
            ${value ? ` value="${value}"` : ""}
            ${autocomplete ? ` autocomplete="${autocomplete}"` : ""}
            ${type === "date"
              ? Validator.minAndMaxDateParser(label as string, date)
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
          ${type === "radio"
            ? label : ""}
          ${name === "file-text"
            ? (
                `<div id="search-photo">
                  <button type="button">Rechercher</button>
                </div>`
              )
            : ""
          }`
        )}
      </label>`
      )
    : isProfilInputs || name === "photo"
    ? ""
    : (
      `<input type="${type}"
        ${value ? ` value="${value}"` : ""}
      >`
    ))
    .join("")
  }
}