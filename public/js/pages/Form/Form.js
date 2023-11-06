import { PageBuilder } from "../Builder.js";
import { FormHelper } from "../../utils/FormHelper.js";

export class FormPage extends PageBuilder {
  renderForm = (
    id = "users",
  ) => {
    /** @type {HTMLFormElement} */
    const form = document.querySelector(`#data-${id}-form form`);

    form.addEventListener(
      "submit",
      (e) => this.submitHandler(e),
    );
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
    const modalBtns = modal.querySelectorAll("button[data-type=\"canceller\"]");

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

    // Set form
    this.renderForm(id);

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
        btn.addEventListener("click", () => {
          modal.classList.add("none");
        })
      }
  };

  submitHandler = async (e) => {
    e.preventDefault();

    const method = location.pathname === "/profil" ? "PUT" : null;

    const formData = FormHelper.setFormData(e.target);
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

          case location.origin + "/profil":
            FormHelper.showProfilDetails(res);
            break;
        }
      }
    } else {
      FormHelper.showErrorMsg(res, location.pathname);
    }
  };
}
