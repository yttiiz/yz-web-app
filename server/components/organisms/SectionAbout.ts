import {
  ComponentType,
  Dialog,
  FormDataType,
  InputsForm,
  OrganismNameType,
} from "@components";
import { Helper } from "@utils";

const { title, action, method, content, paragraph, subtitle } = await Helper
  .convertJsonToObject<
    FormDataType & { subtitle: string; paragraph: string }
  >(
    "/server/data/about/about.json",
  );

export const SectionAbout: ComponentType<OrganismNameType, () => string> = {
  name: "SectionAbout",
  html: () => {
    return `
      <section>
        <div class="container">
          <div> 
            <h1>${title}</h1>
            <p>${paragraph}</p>
            <form
              action="${action}"
              method="${method}"
              type="multipart/form-data"
              data-style
            >
              <h3>${subtitle}</h3>
              <div class="user-infos">
                ${InputsForm.html({ content })}
              </div>
            </form>
          </div> 
        </div> 
      </section>
      ${Dialog.html({})}
    `;
  },
};
