// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
  LoginRegister,
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";

export const Dialog: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "Dialog",
  html: (isLoginNeeded: boolean) => {
    return `
    <dialog>
      <header>
        <h2></h2>
        <button data-close>
          <span></span>
          <span></span>
        </button>
      </header>
      <div>
        <p></p>
        ${isLoginNeeded
          ? LoginRegister.html
          : ""
        }
      </div>
    </dialog>
    `
  },
};
