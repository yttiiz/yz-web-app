import { Helper } from "@utils";
import type { ComponentType, DeleteAccountType } from "../mod.ts";

const {
  deleteModal,
}: DeleteAccountType = await Helper.convertJsonToObject(
  "/server/data/profil/delete.profil.json",
);

export const DeleteAccountForm: ComponentType = {
  name: "DeleteAccountForm",
  content: `
  <div class="delete-account-modale none">
    <form
      data-type="delete-account"
      action="${deleteModal.action}"
      method="${deleteModal.method}"
      type="multipart/form-data"
    >
      <button type="button" data-type="canceller">
        <span></span>
        <span></span>
      </button>
      <h3>${deleteModal.title}</h3>
      <p>${deleteModal.paragraph}</p>
      <span>
        <button type="button" data-type="canceller">
          Annuler
        </button>
        <input type="submit" value="${deleteModal.btnText}" />
      </span>
    </form>
  </div>`,
};
