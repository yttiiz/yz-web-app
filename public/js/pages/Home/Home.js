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
   * @param {Types.Users} users
   */
  renderContent = (users) => {
    const sharedBtn = document.querySelectorAll(".social-btns button:last-of-type");
    /** @type {HTMLDialogElement} */
    const dialog = document.querySelector(`#data-home dialog`);

    // Init display event 'share link' dialog modal.
    for (const btn of sharedBtn) {
      btn.addEventListener("click", (e) => {
        
        // Select 'li' (card) then 'h3'.
        const productName = e.currentTarget.closest("li")
        .querySelector("h3").textContent;

        DefaultFormHelper.setHomeDialogContent(
          dialog,
          {
            title: "Partagez sur les réseaux",
            paragraph: `Copiez le lien vers <b>${productName}</b>, ci-dessous, pour le partager où vous le souhaitez.`,
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

    const sections = [
      this.#renderSection(users, this.#renderUsers),
    ];

    for (const section of sections) {
      this.insertChildren(
        this.#root,
        section,
      );
    }
  };

  /**
   * @param {{ errorMsg: string }} message
   */
  renderError = ({ errorMsg }) => {
    /** @type {[HTMLDivElement, HTMLParagraphElement]} */
    const [
      section,
    ] = this.createHTMLElements("section");

    section.innerHTML = `
    <div class="container">
      <div>
        <h1>Connexion impossible</h1>
        <p>${errorMsg}</p>
      </div>
    </div>`;

    this.insertChildren(this.#root, section);
  };

  /**
   * @param {Types.Users | unknown} items
   * @param {() => HTMLElement} renderer
   * @param {HTMLUListElement} listItems
   */
  #renderSection = (
    items,
    renderer,
    listItems = document.createElement("ul"),
  ) => {
    const [
      section,
      container,
      title,
    ] = this.createHTMLElements("section", "div", "h1");

    listItems = renderer(items, listItems);

    container.classList.add("container");

    title.textContent = "Liste des utilisateurs actifs";
    this.insertChildren(container, title, listItems);
    this.insertChildren(section, container);

    return section;
  };

  /**
   * @param {Types.Users} users
   * @param {HTMLUListElement} usersList
   */
  #renderUsers = (users, usersList) => {
    for (const key in users) {
      /** @type {[HTMLLIElement, HTMLDivElement, HTMLDivElement]} */
      const [user, userInfo, figure] = this.createHTMLElements(
        "li",
        "div",
        "figure",
      );

      /** @type {[HTMLImageElement, HTMLSpanElement, HTMLSpanElement, HTMLSpanElement]} */
      const [img, spec, job, age] = this.createHTMLElements(
        "img",
        "span",
        "span",
        "span",
      );

      img.src = users[key].photo;
      img.alt = `photo de ${users[key].firstname} ${users[key].lastname}`;
      spec.innerHTML = `<b>${users[key].firstname} ${users[key].lastname}</b>`;
      age.textContent = `${this.#getUserAge(users[key].birth)} ans`;
      job.textContent = users[key].job;

      usersList.className = "users";

      this.insertChildren(figure, img);
      this.insertChildren(userInfo, spec, job, age);
      this.insertChildren(user, figure, userInfo);
      this.insertChildren(usersList, user);
    }

    return usersList;
  };

  #getUserAge = (date) => {
    return new Date(Date.now() - new Date(date).getTime())
      .getFullYear() - 1970;
  };
}
