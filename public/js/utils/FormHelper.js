export class FormHelper {
  static id = (id) => `#data-${id}-form`;

  /**
   * @param {Response} response 
   */
  static showRegisterDetails = async (response) => {
    const { id, name } = await response.json();
    FormHelper.#paragraphToShowInfo({
      msg: `${name} a été enregistré avec succès sous l'id : ${id}`,
      dataSet: "success",
    }, "users");
  };

  /**
   * @param {Response} response 
   */
  static showLoginDetails = async (response) => {
    const { message } = await response.json();
    FormHelper.#paragraphToShowInfo({
      msg: `Veuillez réessayer de nouveau, ${message}.`,
      dataSet: "error",
    }, "users");
  };

  /**
   * @param {Response} response 
   */
  static showProfilDetails = async (response) => {
    const status = response.status;
    const { message } = await response.json();
    FormHelper.#paragraphToShowInfo({
      msg: message,
      dataSet: status === 201 ? "success" : "error",
    }, "profil");
  }

  /**
   * @param {Response} response 
   * @param {"/profil" | "/login" | "/register"} pathname 
   */
  static showErrorMsg = async (response, pathname) => {
    const status = response.status;
    const id = pathname === "/profil" ? "profil" : "users";
    const { errorMsg } = await response.json();
    FormHelper.#paragraphToShowInfo({
      msg: errorMsg + status,
      dataSet: "error",
    }, id);
  };
  
  /** 
   * @param {{ msg: string; dataSet: "error" | "success" }} param 
   * @param {string} id
   */
  static #paragraphToShowInfo = ({ msg, dataSet }, id) => {
    /** @type {HTMLParagraphElement} */
    let box;

    /** @type {HTMLDivElement} */
    const container = document.querySelector(FormHelper.id(id));

    if (container.querySelector("p[data-msg-infos]")) {
      box = container.querySelector("p[data-msg-infos]");
    } else {
      box = document.createElement("p");
      container.appendChild(box);
    }

    box.dataset.msgInfos = dataSet;
    box.textContent = msg;
  };

  /**
   * @param {NodeListOf<HTMLInputElement>} inputs 
   */
  static removeInputsValues = (inputs) => {
    for (let i = 0; i < inputs.length - 1; i++) {
      inputs[i].value = "";
    }
  };

  /**
   * @param {HTMLFormElement} form 
   */
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
