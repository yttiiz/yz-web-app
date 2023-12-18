import { PageBuilder } from "../Builder.js";
import * as Types from "../../types/types.js";

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
   * @param {number} status
   * @param {string} url
   */
  renderError = (status, url) => {
    const [
      section,
      container,
      title,
      text,
    ] = this.createHTMLElements("section", "div", "h1", "p");

    const displayError = (
      msg = status === 404
        ? "Aucune api trouvée à cette adresse : " + url
        : "Erreur interne du serveur.",
    ) => {
      title.textContent = "Erreur code : " + status;
      text.textContent = msg;
    };

    displayError();

    container.classList.add("container");

    this.insertChildren(container, title, text);
    this.insertChildren(section, container);
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
