import { PageBuilder } from "../Builder.js";

export class HomePage extends PageBuilder {
  #root;
  constructor() {
    super();
    this.#root = document.querySelector("#data-users");
  }

  renderUsers = (users) => {
    const [title, list] = this.createHTMLElements("h1", "ul");

    for (const key in users) {
      const [li, div, figure] = this.createHTMLElements("li", "div", "figure");
      const [img, spec, job, age] = this.createHTMLElements(
        "img",
        "span",
        "span",
        "span",
      );

      img.src = users[key].photo;
      img.alt = `photo de ${users[key].firstname} ${users[key].lastname}`;
      spec.innerHTML = `<b>${users[key].firstname} ${users[key].lastname}</b>`;
      age.textContent = `${this.getAge(users[key].dateOfBirth)} ans`;
      job.textContent = users[key].job;

      this.insertChildren(figure, img);
      this.insertChildren(div, spec, job, age);
      this.insertChildren(li, figure, div);
      this.insertChildren(list, li);
    }

    title.textContent = "Liste des utilisateurs actifs";
    this.insertChildren(this.#root, title, list);
  };

  renderError = (status) => {
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
        displayError("Le serveur de l'api ne répond pas.");
    }

    this.insertChildren(this.#root, title, text);
  };

  getAge = (date) => {
    return new Date(Date.now() - new Date(date).getTime())
      .getFullYear() - 1970;
  };
}
