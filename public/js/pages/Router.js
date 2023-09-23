// deno-lint-ignore-file
import { HomePage, FormPage } from "./mod.js";

export class Router {
  #home;
  #login;
  #register;
  #update;

  constructor() {
    this.route = location.href;
    this.host = location.origin + '/';
    this.#home = new HomePage();
    this.#login = new FormPage();
    this.#register = new FormPage();
    this.#update = new FormPage();
    this.#router();
  }

  async #router() {
    switch (this.route) {
      case this.host: {
        const res = await this.#fetchData("api");

        if (res.ok && res.status === 200) {
          const users = await res.json();
          this.#home.renderUsers(users);
          break;
        }

        this.#home.renderError(res.status);
        break;
      }

      case this.host + "register": {
        this.#register.renderForm(`${this.host}register`);
        break;
      }

      case this.host + "login": {
        this.#login.renderForm(`${this.host}login`);
        break;
      }

      case this.host + "update": {
        this.#login.renderForm(`${this.host}login`);
        break;
      }
    }
  }

  async #fetchData(route) {
    return fetch(`${this.host}${route}`);
  }
}
