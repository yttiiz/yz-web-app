// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import {
  InputsForm,
  type AdminDataType,
  type ComponentType,
  type OrganismNameType,
} from "../mod.ts";

const {
  home: {
    title,
    paragraph,
    form,
  },
 }: AdminDataType = await Helper.convertJsonToObject(
  "/server/data/basics/admin.json",
 );

export const SectionAdmin: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "SectionAdmin",
  html: (content: string) => {
    return `
    <section>
      <div class="container">
        <div>
          <h1>${title}</h1>
          <p>${paragraph}</p>
        </div>
        <div>
          <form
            action="${form.action}"
            method="${form.method}"
            type="multipart/form-data"
            data-style="user-${form.action.replace("/", "")}"
          >
            <h3>${form.title}</h3>
            <div>
              ${InputsForm.html(form.content, false)}
            </div>
          </form>
        </div>
      </div>
    </section>`;
  },
};
