// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import { InputsForm } from "../mod.ts";
import type { ComponentType, FormDataType, OrganismNameType } from "../mod.ts";

export const SectionAuthForm: ComponentType<
  OrganismNameType,
  (...args: any[]) => Promise<string>
> = {
  name: "SectionAuthForm",
  html: async (path: string) => {
    const {
      title,
      action,
      method,
      content,
    }: FormDataType = await Helper.convertJsonToObject(
      `/server/data/authentication${path}.json`,
    );

    return `
    <section>
      <div class="container">
        <h1>${title}</h1>
        <form
          action="${action}"
          method="${method}"
          type="multipart/form-data"
          data-style="user-${action.replace("/", "")}"
        >
          ${InputsForm.html(content, false)}
        </form>
      </div>
    </section>`;
  },
};
