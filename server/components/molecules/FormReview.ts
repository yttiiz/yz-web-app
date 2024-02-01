// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
  type ComponentType,
  type MoleculeNameType,
  type FormDataType,
  InputsForm,
  InputsGroupForm,
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
    const submitBtn: InputDataType[] = [];
    const inputs: InputDataType[] = [];
    
    for (const field of content) {
      switch(field.type) {
        case "textarea": 
          textArea = field;
          break;

        case "submit":
          submitBtn.push(field);
          break;

        default:
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
            ${InputsGroupForm.html({ content: inputs })}
            ${InputsForm.html({ content: submitBtn })}
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
