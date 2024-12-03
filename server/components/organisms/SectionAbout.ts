import { ComponentType, OrganismNameType } from "@components";
import { Helper } from "@utils";

export const SectionAbout: ComponentType<
  OrganismNameType,
  () => Promise<string>
> = {
  name: "SectionAbout",
  html: async () => {
    const { title, textContent } = await Helper.convertJsonToObject(
      "/server/data/about/about.json",
    );

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
