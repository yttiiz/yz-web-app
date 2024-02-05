import { setFormData } from "../../utils/_commonFunctions.js";

export class AdminFormsHelper {
  static #setFormData = setFormData;

  static init = () => {
    for (const dialog of document.querySelectorAll("#data-admin dialog")) {
      
      if (!dialog.dataset.hasOwnProperty("profil") && !dialog.dataset.hasOwnProperty("response")) {
        dialog.querySelector("form")
        .addEventListener("submit", AdminFormsHelper.#handleForm);
      }

    }
  }

  /**
   * @param {Event} e 
   */
  static #handleForm = async (e) => {
    e.preventDefault();

    const formData = AdminFormsHelper.#setFormData(e.target);

    const res = await fetch(e.target.action, {
      method: "PUT",
      body: formData,
    });

    AdminFormsHelper.#displayMessage(e.target, await res.json());
  }
  
  /**
   * @param {HTMLDialogElement} form
   * @param {{ title: string; message: string }}  
   */
  static #displayMessage = (form, { title, message }) => {
    const responseDialog = document.querySelector("dialog[data-response]");

    responseDialog.querySelector("h2").textContent = title;
    responseDialog.querySelector("p").textContent = message;
    
    form.closest("dialog").close();
    responseDialog.showModal();
  }
}