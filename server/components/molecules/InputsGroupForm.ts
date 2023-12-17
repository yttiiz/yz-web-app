// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import type {
  ComponentType,
  InputDataType,
  MoleculeNameType
} from "../mod.ts";

const handleLabel = (label: string, index: number) => {
  return label.includes("-")
   ? label.split(" - ").at(index)
   : label;
};

export const InputsGroupForm: ComponentType<
  MoleculeNameType, 
  (...args: any[]) => string
> = {
  name: "InputsGroupForm",
  html: (
    content: InputDataType[],
    isProfilInputs: true | false = true
  ) => {
    return `<div>
    ${content
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
            <span>${label ? handleLabel(label, 0) : ""}</span>
            <input type="${type}"
              ${name ? ` name="${name}"` : ""}
              ${placeholder ? ` placeholder="${placeholder}"` : ""}
              ${required ? ` required` : ""}
              ${minLength ? ` minLength="${minLength}"` : ""}
              ${maxLength ? ` maxLength="${maxLength}"` : ""}
              ${value ? ` value="${value}"` : ""}
              ${autocomplete ? ` autocomplete="${autocomplete}"` : ""}
            >
            <span>${label ? handleLabel(label, 1) : ""}</span>
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
    }</div>`
  }
}