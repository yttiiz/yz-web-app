import { PageBuilder } from "../Builder.js";
import { FormHelper } from "../../utils/FormHelper.js";

export class FormPage extends PageBuilder {
  renderForm = (
    route,
    root = document.querySelector("#data-users-form"),
  ) => {
    const form = root.querySelector("form");

    //Set form
    this.setSameHTMLElementAttributes("method", "post", form);
    this.setSameHTMLElementAttributes("type", "multipart/form-data", form);
    this.setSameHTMLElementAttributes("action", route, form);

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
      switch (res.redirected) {
        case true:
          window.location.href = res.url;
          break;

        default:
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
      alert(e.target.dataset.error);
    }
  };
}
