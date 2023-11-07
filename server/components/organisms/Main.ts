import type { ComponentType } from "../mod.ts";

export const Main: ComponentType = {
  name: "Main",
  content: `<main>
    <div class="container">
      <section>
        <div id="{{ id }}">{{ content-insertion }}</div>
      </section>
    </div>
    </main>`,
};
