import { Builder } from "../mod.js";

export class RegisterPage extends Builder {
  renderForm = (
    registerRoute,
    root = document.querySelector("#data-users-form"),
  ) => {
    const form = root.querySelector("form");

    //Set form
    this.setSameHTMLElementAttributes("method", "post", form);
    this.setSameHTMLElementAttributes("type", "multipart/form-data", form);
    this.setSameHTMLElementAttributes("action", registerRoute, form);

    form.addEventListener(
      "submit",
      (e) => this.submitHandler(e),
    );
  };
}
