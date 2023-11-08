import { Helper } from "@utils";
import type { ComponentType, DeleteAccountType } from "../mod.ts";

const {
  deleteAccount,
}: DeleteAccountType = await Helper.convertJsonToObject(
  "/server/data/profil/delete.profil.json",
);

export const DeleteAccount: ComponentType = {
  name: "DeleteAccount",
  html: `
  <div class="delete-account">
    <h3>${deleteAccount.title}</h3>
    <p>${deleteAccount.paragraph}</p>
    <button type="button" data-type="call-to-action">
      ${deleteAccount.btnText}
    </button>
  </div>`,
};
