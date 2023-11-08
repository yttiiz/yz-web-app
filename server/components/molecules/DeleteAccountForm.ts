import { Helper } from "@utils";
import type { ComponentType, DeleteAccountType } from "../mod.ts";

const {
  deleteModal,
}: DeleteAccountType = await Helper.convertJsonToObject(
  "/server/data/profil/delete.profil.json",
);

export const DeleteAccountForm: ComponentType = {
  name: "DeleteAccountForm",
  html: `
  <div class="delete-account-modale none">
    <div>
      <button type="button" data-type="canceller">
        <span></span>
        <span></span>
      </button>
      <h3>${deleteModal.title}</h3>
      <p>${deleteModal.paragraph}</p>
      <form
        action="${deleteModal.action}"
        method="${deleteModal.method}"
        data-type="delete-account"
        type="multipart/form-data"
      >
        <button type="button" data-type="canceller">
          Annuler
        </button>
        <input
          type="submit"
          name="delete-account"
          value="${deleteModal.btnText}"
        />
      </form>
      <span class="show-message-to-user none">
        <a href="/">Retour à l'accueil</a>
      </span>
    </div>
  </div>`,
};
