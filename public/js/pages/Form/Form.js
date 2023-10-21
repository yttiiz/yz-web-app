import { PageBuilder } from "../Builder.js";
import { FormHelper } from "../../utils/FormHelper.js";

export class FormPage extends PageBuilder {
  renderForm = (
    id = "users",
  ) => {
    const form = document.querySelector(`#data-${id}-form form`)

    form.addEventListener(
      "submit",
      (e) => this.submitHandler(e),
    );
  };

  submitHandler = async (e) => {
    e.preventDefault();

    const formData = FormHelper.setFormData(e.target);
    const res = await fetch(e.target.action, {
      method: "POST",
      body: formData,
    });

    FormHelper.removeInputsValues(e.target.children);

    if (res.ok && res.status === 200) {
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
        }
      }
    } else {
      FormHelper.showErrorMsg(res);
    }
  };

  renderProfilForm = (
    id,
    {
      firstname,
      lastname,
      email,
      job,
      birth,
      photo,
    },
  ) => {
    const content = document.querySelector(`#data-${id}-form div`);
    const [img] = this.createHTMLElements("img");
    
    // Set photo
    img.src = photo;
    img.alt = `photo de ${firstname} ${lastname}`;

    this.insertChildren(content, img);

    this.renderForm(id);
  }
}
