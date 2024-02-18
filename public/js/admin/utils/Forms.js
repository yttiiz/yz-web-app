import { setFormData } from "../../utils/_commonFunctions.js";

export class Forms {
  static #setFormData = setFormData;

  static init = () => {
    for (const dialog of document.querySelectorAll("#data-admin dialog")) {
      if (
        !dialog.dataset.hasOwnProperty("profil") &&
        !dialog.dataset.hasOwnProperty("response")
      ) {
        dialog.querySelector("form")
          .addEventListener("submit", Forms.#handleForm);
      }
    }
  };

  /**
   * @param {Event} e
   */
  static #handleForm = async (e) => {
    e.preventDefault();

    const isCreateForm = e.target.action.includes("create");
    const isDeleteForm = e.target.closest("dialog").dataset.hasOwnProperty(
      "delete",
    );
    const formData = Forms.#setFormData(e.target);

    if (e.target.action.includes("booking")) {
      isDeleteForm
        ? Forms.#insertDatasetsInFormDataFromDeleteBtn(
          formData,
          e.target,
        )
        : Forms.#insertDatasetsInFormDataFromEditBtn(
          formData,
          e.target,
        );
    }

    const method = isDeleteForm
      ? "DELETE"
      : (isCreateForm
          ? "POST"
          : "PUT"
        );

    const res = await fetch(e.target.action, {
      method,
      body: formData,
    });

    isDeleteForm
      ? Forms.#displayDeleteMessage(e.target, await res.json())
      : Forms.#displayMessage(e.target, await res.json());
  };

  /**
   * @param {FormData} formData
   * @param {HTMLFormElement} form
   */
  static #insertDatasetsInFormDataFromEditBtn = (formData, form) => {
    for (const item of ["userId", "userName", "createdAt"]) {
      formData.append(
        item,
        form.querySelector(`input[name="${item}"]`).dataset[item],
      );
    }
  };

  /**
   * @param {FormData} formData
   * @param {HTMLFormElement} form
   */
  static #insertDatasetsInFormDataFromDeleteBtn = (formData, form) => {
    /**
     * @param {string} item
     */
    const recoverData = (item) => {
      form.dataset[item].split(";")
        .map((details) => {
          const [name, value] = details.split(":");
          formData.append(
            name,
            value,
          );
        });
    };

    for (const item of ["id", "itemName", "itemDetails"]) {
      if (item === "itemDetails") {
        recoverData(item);
        continue;
      }

      formData.append(
        item,
        form.dataset[item],
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
  };

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
  };
}
