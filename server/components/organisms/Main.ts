import type { ComponentType } from "../mod.ts";

export const Main: ComponentType = {
  name: "Main",
  html: `<main>
    <div id={{ id }} class="container">
      {{ content-insertion }}
    </div>
    </main>`,
};
