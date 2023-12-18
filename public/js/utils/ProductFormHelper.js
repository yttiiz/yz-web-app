export class ProductFormHelper {
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
    /** @type {HTMLParagraphElement} */
    let box;

    /** @type {HTMLDivElement} */
    const container = document.querySelector(
      ProductFormHelper.getClassName(className),
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
}
