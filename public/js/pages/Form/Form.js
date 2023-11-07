import { PageBuilder } from "../Builder.js";
import { FormHelper } from "../../utils/FormHelper.js";

export class FormPage extends PageBuilder {
  initForm = (
    id = "users",
  ) => {
    /** @type {HTMLFormElement} */
    const [form, deleteForm] = document.querySelectorAll(
      `#data-${id}-form form`,
    );

    form.addEventListener(
      "submit",
      (e) => this.#submitHandler(e),
    );

    if (deleteForm) {
      deleteForm.addEventListener(
        "submit",
        (e) => this.#submitHandler(e),
      );
    }
  };

  /**
   * @param {string} id
   * @param {{ firstname: string; lastname: string; photo: string }} data
   */
  renderProfilForm = (
    id,
    data,
  ) => {
    /** @type {HTMLDivElement} */
    const userPhotoContainer = document.querySelector(".user-photo");
    const userImg = userPhotoContainer.querySelector("img");

    /** @type {HTMLDivElement} */
    const modal = document.querySelector(".delete-account-modale");
    const modalBtns = modal.querySelectorAll('button[data-type="canceller"]');

    /** @type {NodeListOf<HTMLInputElement>} */
    const userInfosInputs = document.querySelectorAll(".user-infos input");

    // Set user photo
    if (!data.photo.includes("default.png")) {
      userImg.src = data.photo;
      userImg.alt = `photo de ${data.firstname} ${data.lastname}`;
    }

    // Set inputs
    for (const input of userInfosInputs) {
      if (input.type !== "password") {
        input.type === "date"
          ? input.value = data[input.name].split("T").at(0)
          : input.value = data[input.name];
      }
    }

    // Set form submission
    this.initForm(id);

    // Set input file to change photo
    userPhotoContainer.querySelector("button")
      .addEventListener("click", (e) => {
        /** @type {HTMLInputElement} */
        let input;

        if (userPhotoContainer.querySelector("input")) {
          input = userPhotoContainer.querySelector("input");
        } else {
          input = document.createElement("input");
          input.type = "file";
          input.name = "photo";
          userPhotoContainer.insertBefore(input, e.currentTarget);
        }

        input.click();
      });

    // Set button to display form "delete user" modal.
    document.querySelector(".delete-account button")
      .addEventListener("click", () => {
        modal.classList.remove("none");
      });

    // Set button to abort deleting
    for (const btn of modalBtns) {
      btn.addEventListener("click", this.#hideModalHandler);
    }
  };

  /**
   * @param {Event} e 
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const isDeleteForm = e.target.dataset.type === "delete-account";

    const method = location.pathname === "/profil"
      ? (isDeleteForm ? "DELETE" : "PUT")
      : null;

    const formData = isDeleteForm ? null : FormHelper.setFormData(e.target);

    const res = await fetch(e.target.action, {
      method: method ?? "POST",
      body: formData,
    });

    if (location.pathname !== "/profil") {
      FormHelper.removeInputsValues(e.target.children);
    }

    if (res.ok && (res.status === 200 || res.status === 201)) {
      if (res.redirected) {
        window.location.href = res.url;
      } else {
        switch (e.target.action) {
          case location.origin + "/login":
            FormHelper.showLoginDetails(res);
            break;

          case location.origin + "/register":
            FormHelper.showRegisterDetails(res);
            break;

          case location.origin + "/profil": {
            isDeleteForm
              ? FormHelper.showProfilDeleteDetails(
                  res,
                  this.#hideModalHandler,
                )
              : FormHelper.showProfilUpdateDetails(res);
            break;
          }
        }
      }
    } else {
      FormHelper.showErrorMsg(res, location.pathname);
    }
  };

  /**
   * @param {Event} e 
   */
  #hideModalHandler = (e) => {
    e.currentTarget.closest(".delete-account-modale")
    .classList.add("none");
  };
}
