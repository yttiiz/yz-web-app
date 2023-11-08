import type { ComponentType, OrganismNameType } from "../mod.ts";

export const Main: ComponentType<OrganismNameType> = {
  name: "Main",
  html: `<main>
    <div id={{ id }} class="container">
      {{ content-insertion }}
    </div>
    </main>`,
};
