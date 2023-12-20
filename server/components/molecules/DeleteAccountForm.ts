// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
} from "../mod.ts";

export const DeleteAccountForm: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "DeleteAccountForm",
  html: ({
    action,
    method,
    btnText
  }: any) => { 
    return `
      <form
        action="${action}"
        method="${method}"
        data-type="delete-account"
        data-style="delete-user"
        type="multipart/form-data"
      >
        <button type="button" data-close>
          Annuler
        </button>
        <input
          type="submit"
          name="delete-account"
          value="${btnText}"
        />
      </form>
      <span class="show-message-to-user none">
        <a href="/">Retour à l'accueil</a>
      </span>`
  },
};
