// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  OrganismNameType,
} from "../mod.ts";

export const SectionErrorHome: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "SectionErrorHome",
  html: (errorMsg: string) => {

    return `
    <section>
      <div class="container">
        <div>
          <h1>Erreur serveur</h1>
          <p>${errorMsg}</p>
        </div>
      </div>
    </section>`;
  },
};
