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

  static displayDialogToDeleteAccount = () => {
    const dialog = document.querySelector("#data-profil-form > dialog");
    
    UserFormHelper.setProfilDialogContent(
      dialog,
      {
        title: "Suppression du compte",
        paragraph: "Etes-vous vraiment sûr de vouloir supprimer votre compte ?",
      }
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   */
  static displayDialogProfilUpdatedDetails = async (response) => {
    const status = response.status;
    const { message } = await response.json();
    const dialog = document.querySelector("#data-profil-form > dialog");

    UserFormHelper.setProfilDialogContent(
      dialog,
      {
        title: "Mise à jour",
        paragraph: message,
        status,
      },
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   * @param {(e: Event) => void} hideModalhandler
   */
  static displayDialogProfilDeletedDetails = async (
    response,
    hideModalhandler,
  ) => {
    const status = response.status;
    const { message } = await response.json();
    const dialog = document.querySelector("#data-profil-form > dialog");
    
    UserFormHelper.setProfilDialogContent(
      dialog,
      {
        title: "Compte supprimé",
        paragraph: message,
        status,
        handler: hideModalhandler,
      },
    );
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
}
