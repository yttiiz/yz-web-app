// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
  LoginRegister,
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";

export const ProductDialog: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "ProductDialog",
  html: (isLoginNeeded: boolean) => {
    return `
    <dialog>
      <div>
        <h2></h2>
        <p></p>
        ${isLoginNeeded
          ? LoginRegister.html
          : ""
        }
      </div>
      <button>
        <span></span>
        <span></span>
      </button>
    </dialog>
    `
  },
};
