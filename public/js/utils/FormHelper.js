export class FormHelper {
  static id = "#data-users-form";

  static showRegisterDetails = async (response) => {
    const { id, name } = await response.json();
    FormHelper.#createDivToShowInfo(
      `${name} a été enregistré avec succès sous l'id : ${id}`,
    );
  };

  static showLoginDetails = async (response) => {
    const { message } = await response.json();
    FormHelper.#createDivToShowInfo(
      `Veuillez réessayer de nouveau : (${message}).`,
    );
  };

  static showErrorMsg = async (response) => {
    const status = response.status;
    const { errorMsg } = await response.json();
    FormHelper.#createDivToShowInfo(errorMsg + status);
  };

  static #createDivToShowInfo = (msg) => {
    const container = document.querySelector(FormHelper.id);
    const box = document.createElement("div");
    box.textContent = msg;
    container.appendChild(box);
  };

  static removeInputsValues = (inputs) => {
    for (let i = 0; i < inputs.length - 1; i++) {
      inputs[i].value = "";
    }
  };

  static setFormData = (form) => {
    const formData = new FormData(form);

    for (const [key, value] of formData) {
      //Check for file field.
      if (typeof value === "object" && value.size === 0) {
        formData.delete(key);
      }
    }

    return formData;
  };
}
