import { UserFormHelper } from "../../utils/UserFormHelper.js";

export class AdminForm {
  initForm = () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", this.#submitHandler);
  }

  /**
   * @param {Event} e 
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const formData = UserFormHelper.setFormData(e.target);

    const res = await fetch(e.target.action, {
      method: "POST",
      body: formData,
    });

    if (res.ok && (res.status === 200 || res.status === 201)) {
      console.log(await res.json())
    }
  }
}