import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";

export class AdminProfilHelper extends DefaultFormHelper {
  /**
   * @param {NodeListOf<HTMLButtonElement>} buttons 
   */
  static profilHandler = (buttons) => {
    for (const button of buttons) {
      button.addEventListener("click", () => {
        AdminProfilHelper.openDialogAdminProfil();
      })
    }
  };

  /**
   * @param {HTMLDialogElement} dialog 
   */
  static openDialogAdminProfil = (
    dialog = document.querySelector("dialog"),
  ) => {
    AdminProfilHelper.setUserDialogContent(
      dialog,
      {
        title: "Profil administrateur",
        paragraph: "Mettez à jour vos informations !",
      },
    );

    dialog.showModal();
  }
}