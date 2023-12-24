import { DefaultFormHelper } from "./DefaultFormHelper.js";

export class ProductFormHelper extends DefaultFormHelper {
  static getClassName = (className) => `#data-product .${className}`;

  /**
   * @param {Response} response
   */
  static displayDialogUserReviewDetails = async (response) => {
    const status = response.status;
    const { message } = await response.json();

    const dialog = document.querySelector("#data-product > dialog");
    ProductFormHelper.#setDialogContent(
      dialog,
      {
        title: "Félicitations",
        paragraph: message,
        status,
      },
    );

    dialog.showModal();
  };

  /**
   * @param {Response} response
   */
  static displayDialogUserBookingDetails = async (response) => {
    const status = response.status;
    /** @type {{ message: string; booking: Record<string, unknown>}} */
    const { title, message, booking, email } = await response.json();

    let paragraph = message
      .replace("{{ start }}", booking.start)
      .replace("{{ end }}", booking.end);

    if (email) {
      paragraph = paragraph.replace("{{ email }}", email);
    }

    const dialog = document.querySelector("#data-product > dialog");
    ProductFormHelper.#setDialogContent(
      dialog,
      {
        title,
        paragraph,
      },
    );

    dialog.showModal();
  };

  /**
   * @param {boolean} isUserConnected
   */
  static displayDialogLoginInfoToUser = (isUserConnected) => {
    const dialog = document.querySelector("#data-product > dialog");
    ProductFormHelper.#setDialogContent(
      dialog,
      {
        isUserConnected,
        title: "Connectez-vous !",
        paragraph:
          "Vous devez vous connecter pour pouvoir réserver un créneau !",
      },
    );

    dialog.showModal();
  };

  /**
   * @param {HTMLDialogElement} dialog
   * @param {{
   * isUserConnected?: boolean;
   * title: string;
   * paragraph: string;
   * status: number;
   * }} param
   */
  static #setDialogContent = (
    dialog,
    {
      isUserConnected,
      title,
      paragraph,
      status,
    },
  ) => {
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("p").textContent = paragraph;

    if (isUserConnected || isUserConnected === undefined) {
      if (!dialog.querySelector(".login-register").classList.contains("none")) {
        dialog.querySelector(".login-register").classList.add("none");
      }

      // TODO implements status logic.
    } else {
      if (dialog.querySelector(".login-register").classList.contains("none")) {
        dialog.querySelector(".login-register").classList.remove("none");
      }
    }
  };
}
