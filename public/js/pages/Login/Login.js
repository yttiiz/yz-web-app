import { Builder } from "../mod.js";

export class LoginPage extends Builder {
  renderForm = (
    loginRoute,
    root = document.querySelector("#data-users-form"),
  ) => {
    const form = root.querySelector("form");

    //Set form
    this.setSameHTMLElementAttributes("method", "post", form);
    this.setSameHTMLElementAttributes("type", "multipart/form-data", form);
    this.setSameHTMLElementAttributes("action", loginRoute, form);

    form.addEventListener(
      "submit",
      (e) => this.submitHandler(e),
    );
  };
}
