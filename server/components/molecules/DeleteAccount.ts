import { Helper } from "@utils";
import type {
  ComponentType,
  DeleteAccountDataType,
  MoleculeNameType,
} from "../mod.ts";

const {
  deleteAccount,
}: DeleteAccountDataType = await Helper.convertJsonToObject(
  "/server/data/profil/delete.profil.json",
);

export const DeleteAccount: ComponentType<MoleculeNameType> = {
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
