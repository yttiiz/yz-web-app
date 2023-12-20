import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class ProductFormHelper extends DefaultFormHelper {
  static getClassName = (className) => `#data-product .${className}`;

  /**
   * @param {Response} response
   */
  static showProductUserReviewDetails = async (response) => {
    const status = response.status;
    const { message, className } = await response.json();

    ProductFormHelper.#paragraphToShowInfo({
      msg: message,
      dataSet: status === 200 ? "success" : "error",
    }, className);
  };

  /**
   * @param {{ msg: string; dataSet: "error" | "success" }} param
   * @param {string} className
   */
  static #paragraphToShowInfo = ({ msg, dataSet }, className) => {
    /** @type {HTMLDivElement} */
    const container = document.querySelector(
      ProductFormHelper.getClassName(className),
    );

    const box = ProductFormHelper.getOrCreateElement({
      parent: container,
      cssSelector: "p[data-msg-infos]",
      hmtlTag: "p",
    })

    box.dataset.msgInfos = dataSet;
    box.textContent = msg;
  };

  /**
   * @param {HTMLFormElement} form 
   */
  static displayDialogLoginInfoToUser(form) {
    const dialog = form.closest("#data-product")
    .querySelector("dialog");
    
    dialog.querySelector("button[data-close]").addEventListener("click", () => {
      dialog.close();
    })
    dialog.showModal();
  }
}
