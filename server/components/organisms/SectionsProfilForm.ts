// deno-fmt-ignore-file
import { Helper } from "@utils";
import {
  InputsForm,
  DeleteAccount,
  DeleteAccountForm,
  Dialog,
  DangerSvg,
} from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  FormDataType,
  DeleteAccountDataType,
  DialogDataType,
 } from "../mod.ts";

 const {
  title,
  action,
  method,
  changePhoto,
  content,
}: FormDataType = await Helper.convertJsonToObject(
  "/server/data/profil/profil.json",
);

const {
  deleteModal,
}: DeleteAccountDataType = await Helper.convertJsonToObject(
  "/server/data/profil/delete.profil.json",
);

export const SectionsProfilForm: ComponentType<
  OrganismNameType,
  () => string
> = {
  name: "SectionsProfilForm",
  html: () => {
    return `
    <section>
      <div class="container">
        <h1>${title}</h1>
        <p class="error-msg none">${DangerSvg.html}</p>
        <form
          action="${action}"
          method="${method}"
          type="multipart/form-data"
          data-style="user-profil"
        >
          <div>
            <div class="user-photo">
              <figure>
                <img src="/img/users/default.png" alt="default user image" />
              </figure>
              <button type="button">${changePhoto ?? "change picture"}</button>
              <div class="none"></div>
            </div>
            <div class="user-infos">
              ${InputsForm.html({ content, isProfilInputs: true })}
            </div>
          </div>
          <input
            type="${content.at(-1)!.type}"
            value="${content.at(-1)!.value}"
          />
        </form>
      </div>
    </section>
    <section>
      ${DeleteAccount.html}
    </section>
    ${Dialog.html({
      component: DeleteAccountForm.html({
        action: deleteModal.action,
        method: deleteModal.method,
        btnText: deleteModal.btnText,
      })
    } as DialogDataType)}
    `;
  }
}