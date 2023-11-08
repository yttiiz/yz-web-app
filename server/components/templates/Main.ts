import type { ComponentType, TemplateNameType } from "../mod.ts";

export const Main: ComponentType<TemplateNameType> = {
  name: "Main",
  html: `<main>
    <div id={{ id }} class="container">
      {{ content-insertion }}
    </div>
    </main>`,
};
