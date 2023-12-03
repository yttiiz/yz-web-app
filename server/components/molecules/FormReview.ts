// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
  type ComponentType,
  type MoleculeNameType,
  type FormDataType,
  InputsForm,
  LoginRegister,
  TextAreaForm,
  InputDataType,
} from "../mod.ts";

export const FormReview: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "FormReview",
  html: (
    {
      title,
      action,
      method,
      content,
    }: FormDataType,
    isUserConnected: boolean,
  ) => {
    let textArea: InputDataType = { type: "textarea" };
    const inputs: InputDataType[] = [];
    
    for (const field of content) {
      if (field.type === "textarea") {
        textArea = field;
      } else {
        inputs.push(field);
      }
    }

    return `
    <h3>${title}</h3>
    ${isUserConnected
      ? (
        ` 
          <form
            action="${action}"
            method="${method}"
          >
            ${TextAreaForm.html(textArea)}
            ${InputsForm.html(inputs, false)}
          </form>
        `
      )
      :
      (
        `<p>Connectez-vous pour pouvoir laisser un avis.</p>
          ${LoginRegister.html}
        `
      )
    }
    `
  },
};
