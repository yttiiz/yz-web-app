import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class UserFormHelper extends DefaultFormHelper {
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
   * @param {{ msg: string; dataSet: "error" | "success" }} param
   * @param {string} id
   */
  static #paragraphToShowInfo = ({ msg, dataSet }, id) => {
    /** @type {HTMLDivElement} */
    const container = document.querySelector(
      UserFormHelper.id(id) + " section",
    );

    const box = UserFormHelper.getOrCreateElement({
      parent: container,
      cssSelector: "p[data-msg-infos]",
      hmtlTag: "p",
    });

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
