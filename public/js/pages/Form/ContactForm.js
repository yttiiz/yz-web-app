import { ContactFormHelper } from "../../utils/ContactFormHelper.js";
import { PageBuilder } from "../Builder.js";

export class ContactFormPage extends PageBuilder {
  initForm = (id = "#data-contact") => {
    /** @type {HTMLFormElement} */
    const form = document.querySelector(`${id} form`);
    const dialog = document.querySelector(`${id} dialog`);

    form.addEventListener("submit", (e) => this.#submitHandler(e));

    // Init close event dialog modal.
    dialog.querySelector("button[data-close]").addEventListener("click", () => {
      dialog.close();
    });
  };

  /**
   * @param {Event} e
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const labels = e.target.querySelectorAll(".user-infos label");

    try {
      const res = await fetch(e.target.action, {
        method: "POST",
        body: formData,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
      });

      if (res.ok) {
        ContactFormHelper.removeInputsValues(labels);
      }

      ContactFormHelper.displayDialog(res);
    } catch (_) {
      ContactFormHelper.displayDialog();
    }
  };
}
