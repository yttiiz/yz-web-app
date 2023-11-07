import { PageBuilder } from "../Builder.js";
import * as Types from "../../types/types.js";

export class HomePage extends PageBuilder {
  #root;

  constructor() {
    super();
    this.#root = document.querySelector("#data-users");
  }

  /**
   * @param {Types.Users} users
   */
  renderUsers = (users) => {
    this.insertChildren(
      this.#root,
      this.#renderUserSection(users),
      );
  };

  /**
   * @param {number} status
   * @param {{ errorMsg: string }}
   */
  renderError = (status, { errorMsg }) => {
    const [title, text] = this.createHTMLElements("h1", "p");
    const displayError = (msg = "Aucune api trouvée à cette adresse.") => {
      title.textContent = "Erreur code : " + status;
      text.textContent = msg;
    };

    switch (status) {
      case 404:
        displayError();
        break;

      default:
        displayError(errorMsg);
    }

    this.insertChildren(this.#root, title, text);
  };

   /**
   * @param {Types.Users} users
   */
  #renderUserSection = (users) => {
    const [
      section,
      paragraph,
      title,
      usersList
    ] = this.createHTMLElements("section", "p", "h1", "ul");

    for (const key in users) {
      /** @type {[HTMLLIElement, HTMLDivElement, HTMLDivElement]} */
      const [user, userInfo, figure] = this.createHTMLElements("li", "div", "figure");

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

      this.insertChildren(figure, img);
      this.insertChildren(userInfo, spec, job, age);
      this.insertChildren(user, figure, userInfo);
      this.insertChildren(usersList, user);
    }

    title.textContent = "Liste des utilisateurs actifs";
    paragraph.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    this.insertChildren(section, title, paragraph, usersList);

    return section;
  }

  #getUserAge = (date) => {
    return new Date(Date.now() - new Date(date).getTime())
      .getFullYear() - 1970;
  };
}
