import { ComponentType } from "./mod.ts";

export const Main: ComponentType = {
  name: "Main",
  content: `<main>
    <div class="container">
        <section>
            <div id="{{ id }}"></div>
        </section>
    </div>
    </main>`,
};
