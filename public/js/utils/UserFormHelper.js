import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class UserFormHelper extends DefaultFormHelper {
  static id = (id) => `#data-${id}-form`;

  /**
   * @param {Response} response
   */
  static displayDialogRegisterDetails = async (response) => {
    const { message } = await response.json();
    const dialog = document.querySelector("#data-user-form > dialog");

    UserFormHelper.setUserDialogContent(
      dialog,
      {
        title: message.includes("suspects") ? "Avertissement" : "Bienvenue",
        paragraph: message,
      },
    );

    dialog.showModal();
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
      },
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   */
  static displayDialogProfilUpdatedDetails = async (response) => {
    const id = "#data-profil-form";
    const status = response.status;
    const { message, photo } = await response.json();
    const dialog = document.querySelector(id + " > dialog");

    if (photo) {
      // Set img src to new photo's path. 
      document.querySelector(id + " figure > img")
      .src = photo;

      // Hide user photo details div.
      document.querySelector(".user-photo > div")
      .classList.add("none");
    }

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
   * @param {Event} e 
   */
  static handleInputFile = (e) => {
    /** @type {HTMLInputElement} */
    let input;

    /** @type {HTMLInputElement| HTMLDivElement} */
    let showFileInfos;

    /**
     * @param {HTMLInputElement} input
     * @param {HTMLInputElement| HTMLDivElement} showFileInfos
     */
    const handleFileContent = (input, showFileInfos) => {
      input.addEventListener("change", (event) => {
        if (event.currentTarget.files.length === 1) {
          const { name, size } = event.currentTarget.files[0];
          const sizeInKo = new Intl.NumberFormat("fr-FR", {
            maximumFractionDigits: 2,
          }).format(size / 1000);

          if (showFileInfos instanceof HTMLDivElement) {
            showFileInfos.innerHTML = `Fichier choisi : <b>${name}</b> (taille: ${sizeInKo} ko).`;

            if (showFileInfos.classList.contains("none")) {
              showFileInfos.classList.remove("none");
              showFileInfos.classList.add("show-file");
            }
          } else {
            showFileInfos.value = `${name} (taille: ${sizeInKo} ko)`;
          }
        }
      });
    };

    // Check if it's Profil or Register form.
    e.currentTarget.closest("form").action.includes("/profil")
      ? showFileInfos = e.currentTarget.nextElementSibling
      : showFileInfos = e.currentTarget.closest("div").previousElementSibling;
    
    if (e.currentTarget.querySelector("input")) {
      input = e.currentTarget.querySelector("input");
    } else {
      input = UserFormHelper.createInputTypeFile(input);
      e.currentTarget.closest("div").insertBefore(input, e.currentTarget);
      handleFileContent(input, showFileInfos);
    }

    input.click();
  }

  /**
   * @param {HTMLInputElement} input 
   */
  static createInputTypeFile = (input) => {
    input = document.createElement("input");
    input.type = "file";
    input.name = "photo";
    input.accept = ".png, .jpg, .webp, .jpeg";

    return input;
  };

  /**
   * @param {{ msg: string; dataSet: "error" | "success" }} param
   * @param {string} id
   */
  static #paragraphToShowInfo = ({ msg, dataSet }, id) => {
    /** @type {HTMLDivElement} */
    const container = document.querySelector(
      UserFormHelper.id(id) + " .container",
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
