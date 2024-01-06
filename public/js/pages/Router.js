// deno-lint-ignore-file
import {
  HomePage,
  BookingFormPage,
  ProductFormPage,
  UserFormPage
} from "./mod.js";

export class Router {
  #home;
  #userForm;
  #bookingForm;
  #productForm;

  constructor() {
    this.route = location.href;
    this.host = location.origin + "/";
    this.#home = new HomePage();
    this.#bookingForm = new BookingFormPage();
    this.#userForm = new UserFormPage();
    this.#productForm = new ProductFormPage();
    this.#router();
  }

  async #router() {
    switch (this.route) {
      case this.host: {
        const res = await this.#fetchData("users");

        if (res.ok && res.status === 200) {
          this.#home.renderContent(await res.json());
          break;
        }

        this.#home.renderError(await res.json());
        break;
      }

      //============[ USERS ]============//
      case this.host + "register":
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

      //============[ BOOKING ]============//
      case this.host + "booking": {
        this.#bookingForm.initForm();
        break;
      }

      //============[ PRODUCT ]============//
      default:
        this.#productForm.initForm();
        break;
    }
  }

  /**
   * @param {string} route
   */
  async #fetchData(route) {
    return fetch(`${this.host}${route}`);
  }
}
