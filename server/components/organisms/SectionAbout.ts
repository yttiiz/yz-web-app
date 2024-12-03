import { ComponentType, OrganismNameType } from "@components";
import { Helper } from "@utils";

const { title, textContent } = await Helper.convertJsonToObject<
  { title: string; textContent: string }
>(
  "/server/data/about/about.json",
);

export const SectionAbout: ComponentType<
  OrganismNameType,
  () => string
> = {
  name: "SectionAbout",
  html: () => {
    return `
      <section>
        <div class="container">
          <h1>${title}</h1>
          <div>${textContent}</div> 
        </div> 
      </section>
    `;
  },
};
