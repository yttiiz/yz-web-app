export class UserFormHelper {
  static id = (id) => `#data-${id}-form`;

  /**
   * @param {Response} response
   */
  static showRegisterDetails = async (response) => {
    const { message } = await response.json();

    UserFormHelper.#paragraphToShowInfo({
      msg: message,
      dataSet: message.includes("suspects") ? "error" : "success",
    }, "user");
  };

  /**
   * @param {Response} response
   */
  static showLoginDetails = async (response) => {
    const { message } = await response.json();

    UserFormHelper.#paragraphToShowInfo({
      msg: message,
      dataSet: "error",
    }, "user");
  };

  /**
   * @param {Response} response
   */
  static showProfilUpdateDetails = async (response) => {
    const status = response.status;
    const { message } = await response.json();

    UserFormHelper.#paragraphToShowInfo({
      msg: message,
      dataSet: status === 201 ? "success" : "error",
    }, "profil");
  };

  /**
   * @param {Response} response
   */
  static showProfilDeleteDetails = async (response) => {
    const { message } = await response.json();

    UserFormHelper.#redesignModalToShowInfo(message);
  };

  /**
   * @param {Response} response
   * @param {"/profil" | "/login" | "/register"} pathname
   */
  static showErrorMsg = async (response, pathname) => {
    const status = response.status;
    const id = pathname === "/profil" ? "profil" : "users";
    const { errorMsg } = await response.json();

    UserFormHelper.#paragraphToShowInfo({
      msg: errorMsg + status,
      dataSet: "error",
    }, id);
  };

  /**
   * @param {NodeListOf<HTMLLabelElement>} labels
   */
  static removeInputsValues = (labels) => {
    for (let i = 0; i < labels.length - 1; i++) {
      labels[i].querySelector("input").value = "";
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

  /**
   * @param {{ msg: string; dataSet: "error" | "success" }} param
   * @param {string} id
   */
  static #paragraphToShowInfo = ({ msg, dataSet }, id) => {
    /** @type {HTMLParagraphElement} */
    let box;

    /** @type {HTMLDivElement} */
    const container = document.querySelector(
      UserFormHelper.id(id) + " section",
    );

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
   * @param {string} msg
   * @param {() => void} hideModalhandler
   */
  static #redesignModalToShowInfo = (
    msg,
    hideModalhandler,
  ) => {
    const modal = document.querySelector(".delete-account-modale > div");
    const form = modal.querySelector("form");

    modal.removeChild(form);
    modal.querySelector("p").textContent = msg;
    modal.querySelector(".show-message-to-user")
      .classList.remove("none");

    modal.querySelector("button")
      .removeEventListener("click", hideModalhandler);
    modal.querySelector("button")
      .addEventListener("click", () => window.location.href = "/");
  };
}
