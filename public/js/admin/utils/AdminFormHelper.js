import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";

export class AdminFormHelper extends DefaultFormHelper {
  /**
   * @param {Event} e 
   */
  static loginHandler = async (e) => {
    e.preventDefault();

    const formData = AdminFormHelper.setFormData(e.target);

    const res = await fetch(e.target.action, {
      method: "POST",
      body: formData,
    });

    if (res.ok && (res.status === 200 || res.status === 201)) {
      const responseContent = await res.json();
      
      responseContent["message"] === "connected"
        ? location.reload()
        : AdminFormHelper.displayWrongPassword(responseContent["message"]);

    } else if (res.status === 401) {
      AdminFormHelper.openDialogToUnauthorizedAccess();
    }
  };

  /**
   * @param {string} message 
   */
  static displayWrongPassword = (message) => {
    /** @type {HTMLSpanElement} */
    const span = document.querySelector("form > span");
    
    span.textContent = message;
    span.classList.remove("none");
  }

  /**
   * @param {HTMLDialogElement} dialog 
   */
  static openDialogToUnauthorizedAccess = (
    dialog = document.querySelector("dialog"),
  ) => {
    AdminFormHelper.setUserDialogContent(
      dialog,
      {
        title: "Accès non autorisé",
        paragraph: "Vous n'avez pas les droits pour accéder à la plateforme d'administration.",
      },
    );

    dialog.showModal();
  }
}