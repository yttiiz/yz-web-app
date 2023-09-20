import { Builder } from "../mod.js";

export class LoginPage extends Builder {
  renderForm = (
    data,
    loginRoute,
    root = document.querySelector("#data-users-form"),
  ) => {
    const [title, form] = this.createHTMLElements("h1", "form");

    //Create and set fields
    const [
      email,
      btn,
    ] = data.content
      .map((field) => {
        const input = document.createElement("input");
        input.setAttribute("type", field.type);

        if (field.placeholder) {
          input.setAttribute("placeholder", field.placeholder);
        }
        if (field.name) input.setAttribute("name", field.name);
        if (field.required) input.setAttribute("required", field.required);
        if (field.minLength) input.setAttribute("minLength", field.minLength);
        if (field.maxLength) input.setAttribute("maxLength", field.maxLength);
        if (field.value) input.setAttribute("value", field.value);

        return input;
      });

    //Set form
    this.setSameHTMLElementAttributes("method", "post", form);
    this.setSameHTMLElementAttributes("type", "multipart/form-data", form);
    this.setSameHTMLElementAttributes("action", loginRoute, form);

    this.insertChildren(form, email, btn);
    this.insertChildren(root, title, form);

    title.textContent = data.title;
    form.addEventListener(
      "submit",
      (e) => this.submitHandler(e, data),
    );
  };
}
