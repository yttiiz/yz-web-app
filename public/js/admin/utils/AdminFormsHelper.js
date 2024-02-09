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

    const isDeleteForm = e.target.closest("dialog").dataset.hasOwnProperty("delete");
    const formData = AdminFormsHelper.#setFormData(e.target);

    if (isDeleteForm) {
      formData.set("id", e.target.dataset.id);
      formData.set("itemName", e.target.dataset.itemName);
    }

    const method = isDeleteForm
      ? "DELETE"
      : "PUT";

    if (e.target.action.includes("booking") && !isDeleteForm) {
      AdminFormsHelper.#convertBookingDatasetsToFormDataField(
        formData,
        e.target,
      );
    }

    const res = await fetch(e.target.action, {
      method,
      body: formData,
    });

    isDeleteForm
    ? AdminFormsHelper.#displayDeleteMessage(e.target, await res.json())
    : AdminFormsHelper.#displayMessage(e.target, await res.json());
  }

  /**
   * @param {FormData} formData 
   * @param {HTMLFormElement} form 
   */
  static #convertBookingDatasetsToFormDataField = (formData, form) => {
    for (const item of ["userId", "userName", "createdAt"]) {
      formData.append(
        item,
        form.querySelector(`input[name="${item}"]`).dataset[item],
      );
    }
  };
  
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

  /**
   * @param {HTMLDialogElement} form
   * @param {{ message: string }}  
   */
  static #displayDeleteMessage = (form, { message }) => {
    const spanResponse = form.nextElementSibling;
    const paragraph = form.previousElementSibling;
    
    spanResponse.textContent = message;

    form.classList.add("none");
    paragraph.classList.add("none");
    spanResponse.classList.remove("none");
  }
}