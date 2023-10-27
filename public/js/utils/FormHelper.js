export class FormHelper {
  static id = (id) => `#data-${id}-form`;

  static showRegisterDetails = async (response) => {
    const { id, name } = await response.json();
    FormHelper.#divToShowInfo({
      msg: `${name} a été enregistré avec succès sous l'id : ${id}`,
      dataSet: "success",
    }, "users");
  };

  static showLoginDetails = async (response) => {
    const { message } = await response.json();
    FormHelper.#divToShowInfo({
      msg: `Veuillez réessayer de nouveau, ${message}.`,
      dataSet: "error",
    }, "users");
  };

  static showProfilDetails = async (response) => {
    const { message } = await response.json();
    FormHelper.#divToShowInfo({
      msg: message,
      dataSet: "success"
    }, "profil");
  }

  static showErrorMsg = async (response) => {
    const status = response.status;
    const { errorMsg } = await response.json();
    FormHelper.#divToShowInfo({
      msg: errorMsg + status,
      dataSet: "error",
    }, "users");
  };
  
  /** 
   * @param {{ msg: string; dataSet: "error" | "success" }} param 
   * @param {string} id
   */
  static #divToShowInfo = ({ msg, dataSet }, id) => {
    let box;
    const container = document.querySelector(FormHelper.id(id));

    if (container.querySelector("div[data-msg-infos]")) {
      box = container.querySelector("div[data-msg-infos]");
    } else {
      box = document.createElement("div");
      container.appendChild(box);
    }

    box.dataset.msgInfos = dataSet;
    box.textContent = msg;
  };

  static removeInputsValues = (inputs) => {
    for (let i = 0; i < inputs.length - 1; i++) {
      inputs[i].value = "";
    }
  };

  static setFormData = (form) => {
    const formData = new FormData(form);

    for (const [key, value] of formData) {
      // Check for file (image) field.
      if (typeof value === "object" && value.size === 0) {
        formData.delete(key);
      }
    }

    return formData;
  };
}
