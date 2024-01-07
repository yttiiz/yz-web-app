// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import { InputsForm } from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  FormDataType,
} from "../mod.ts";

const {
    title,
    action,
    method,
    content,
 }: FormDataType = await Helper.convertJsonToObject(
  "/server/data/basics/admin.json",
 );

export const SectionAdmin: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "SectionAdmin",
  html: () => {
    return `
    <section>
      <div class="container">
        <div>
          <h1>${title}</h1>
        </div>
        <div>
          <form
            action="${action}"
            method="${method}"
            type="multipart/form-data"
            data-style="user-${action.replace("/", "")}"
          >
            <h3>Renseignez vos identifiants</h3>
            <div>
              ${InputsForm.html(content, false)}
            </div>
          </form>
        </div>
      </div>
    </section>`;
  },
};
