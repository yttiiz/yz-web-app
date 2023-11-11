// deno-lint-ignore-file
import { UserFormPage, HomePage } from "./mod.js";

export class Router {
  #home;
  #userForm;

  constructor() {
    this.route = location.href;
    this.host = location.origin + "/";
    this.#home = new HomePage();
    this.#userForm = new UserFormPage();
    this.#router();
  }

  async #router() {
    switch (this.route) {
      case this.host: {
        const res = await this.#fetchData("users");

        if (res.ok && res.status === 200) {
          this.#home.renderUsers(await res.json());
          break;
        }

        this.#home.renderError(res.status, await res.json());
        break;
      }

      case this.host + "register": {
        this.#userForm.initForm();
        break;
      }

      case this.host + "login": {
        this.#userForm.initForm();
        break;
      }

      case this.host + "profil": {
        const res = await this.#fetchData("user-profil");

        if (res.ok && res.status === 200) {
          this.#userForm.renderProfilForm(
            "profil",
            await res.json(),
          );
          break;
        }
      }
    }
  }

  /**
   * @param {string} route
   */
  async #fetchData(route) {
    return fetch(`${this.host}${route}`);
  }
}
