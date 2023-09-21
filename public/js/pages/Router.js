// deno-lint-ignore-file
import { HomePage, LoginPage, RegisterPage } from "./mod.js";

export class Router {
  #home;
  #login;
  #register;

  constructor(route) {
    this.route = route;
    this.host = "http://127.0.0.1:3000/";
    this.#home = new HomePage();
    this.#login = new LoginPage();
    this.#register = new RegisterPage();
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
      }

      case this.host + "login": {
        this.#login.renderForm(`${this.host}login`);
      }
    }
  }

  async #fetchData(route) {
    return fetch(`${this.host}${route}`);
  }
}
