// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  MoleculeNameType,
  DialogDataType,
} from "../mod.ts";

export const Dialog: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "Dialog",
  html: ({
      dataset,
      component,
    }: DialogDataType) => {
    return `
    <dialog${dataset ? ` data-${dataset}` : ""}>
      <header>
        <h2></h2>
        <button data-close>
          <span></span>
          <span></span>
        </button>
      </header>
      <div>
        <p></p>
        ${component ? component : ""}
      </div>
    </dialog>
    `
  },
};
