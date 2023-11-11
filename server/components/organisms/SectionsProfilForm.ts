// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { Helper } from "@utils";
import {
  InputsForm,
  DeleteAccount,
  DeleteAccountForm,
} from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  FormDataType,
 } from "../mod.ts";

const obj: FormDataType = await Helper.convertJsonToObject(
  "/server/data/profil/profil.json",
);

export const SectionsProfilForm: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "SectionsProfilForm",
  html: ({
    title,
    action,
    method,
    changePhoto,
    content,
  }: FormDataType = obj,
  ) => {
    return `
    <section>
      <h1>${title}</h1>
      <form
        action="${action}"
        method="${method}"
        type="multipart/form-data"
      >
        <div>
          <div class="user-photo">
            <figure>
              <img src="/img/users/default.png" alt="default user image" />
            </figure>
            <button type="button">${changePhoto ?? "change picture"}</button>
          </div>
          <div class="user-infos">
            ${InputsForm.html(content)}
          </div>
        </div>
        <input
          type="${content.at(-1)!.type}"
          value="${content.at(-1)!.value}"
        />
      </form>
    </section>
    <section>
      ${DeleteAccount.html}
    </section>
    ${DeleteAccountForm.html}
    `;
  }
}