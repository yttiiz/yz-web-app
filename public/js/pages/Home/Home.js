import { PageBuilder } from "../Builder.js";
import * as Types from "../../types/types.js";
import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";

export class HomePage extends PageBuilder {
  #root;

  constructor() {
    super();
    this.#root = document.querySelector("#data-home");
  }

  /**
   * @param {Types.Visits} visits
   */
  renderContent = (visits) => {
    this.#setCardsSharedButtons({
      buttonsSelector: ".social-btns button:last-of-type",
      dialogSelector: "#data-home dialog",
    });

    this.#renderVisits(visits);
  };

  /**
   * @param {{ errorMsg: string }} message
   */
  renderError = ({ errorMsg }) => {
    if (document.querySelector("#visits")) {
      document.querySelector("#visits").innerHTML = `
      <div class="container">
        <div>
          <h1>Connexion impossible</h1>
          <p>${errorMsg}</p>
        </div>
      </div>`;
    }
  };

  /**
   * Handle products cards shared buttons and the dialog pop up they related to.
   * @param {{ buttonsSelector: string; dialoSelector: string; }}
   */
  #setCardsSharedButtons = ({ buttonsSelector, dialogSelector }) => {
    /** @type {HTMLDialogElement} */
    const dialog = document.querySelector(dialogSelector);
    /** @type {NodeListOf<HTMLButtonElement>} */
    const buttons = document.querySelectorAll(buttonsSelector);

    // Init display event 'share link' dialog modal.
    for (const button of buttons) {
      button.addEventListener("click", (e) => {
        // Select 'li' (card) then 'h3'.
        const productName = e.currentTarget.closest("li")
          .querySelector("h3").textContent;

        DefaultFormHelper.setHomeDialogContent(
          dialog,
          {
            title: "Partagez sur les réseaux",
            paragraph:
              `Copiez le lien vers <b>${productName}</b>, ci-dessous, pour le partager où vous le souhaitez.`,
          },
          e.currentTarget,
        );

        dialog.showModal();
      });
    }

    // Init close event dialog modal.
    dialog.querySelector("button[data-close]")
      .addEventListener("click", () => {
        dialog.close();
      });
  };

  /**
   * @param {{
   * items: Types.Visits;
   * renderer: () => HTMLElement;
   * id: string;
   * title: string;
   * listItems: HTMLUListElement;
   * }}
   */
  #renderSection = ({
    items,
    renderer,
    id,
    title,
    listItems = document.createElement("ul"),
  }) => {
    const [
      section,
      container,
      titleElement,
    ] = this.createHTMLElements("section", "div", "h1");

    listItems = renderer(items, listItems);

    container.classList.add("container");

    titleElement.textContent = title;
    this.insertChildren(container, titleElement, listItems);
    this.insertChildren(section, container);
    section.id = id;

    return section;
  };

  /**
   * @param {Types.Visits} visits
   * @param {HTMLUListElement} visitsList
   */
  #renderVisits = (
    visits,
    visitsList = document.querySelector(".visits-cards"),
  ) => {
    for (const key of Object.keys(visits)) {
      /** @type {[HTMLLIElement, HTMLDivElement, HTMLImageElement]} */
      const [container, figure, img] = this.createHTMLElements(
        "li",
        "figure",
        "img",
      );

      /** @type {[HTMLDivElement, HTMLHeadingElement, HTMLParagraphElement, HTMLAnchorElement]} */
      const [content, subtitle, paragraph, link] = this.createHTMLElements(
        "div",
        "h3",
        "p",
        "a",
      );

      img.src = visits[key].image;
      subtitle.textContent = visits[key].title;
      paragraph.textContent = visits[key].text;
      link.href = visits[key].href;
      link.target = "_blank";
      link.textContent = "En savoir plus";

      visitsList.className = "visits-cards";

      this.insertChildren(figure, img);
      this.insertChildren(content, subtitle, paragraph, link);
      this.insertChildren(container, figure, content);
      this.insertChildren(visitsList, container);
    }
  };
}
