import { getApiKey } from "../utils/_commonFunctions.js";

export class Router {
  #home;
  #userForm;
  #bookingForm;
  #productForm;
  #errorMsg;
  #apiKey;

  constructor() {
    this.route = location.href;
    this.host = location.origin + "/";
    this.#errorMsg = "Une erreur est survenue lors du chargement des données.";
    this.#apiKey = getApiKey();
    this.#router();
  }

  async #router() {
    switch (this.route) {
      case this.host:
      case this.host + "#visits": {
        try {
          const res = await this.#fetchData(
            `guadeloupe-islands${this.#apiKey}`,
          );
          const { HomePage } = await import("./Home/Home.js");

          this.#home = new HomePage();

          if (res.ok && res.status === 200) {
            this.#home.renderContent(await res.json());
            break;
          }

          this.#home.renderError({ errorMsg: this.#errorMsg });
          break;
        } catch (_) {
          this.#home.renderError({ errorMsg: this.#errorMsg });
          break;
        }
      }

      //============[ USERS ]============//
      case this.host + "register":
      case this.host + "login": {
        const { UserFormPage } = await import("./Form/UserForm.js");

        this.#userForm = new UserFormPage();
        this.#userForm.initForm();
        break;
      }

      case this.host + "profil": {
        try {
          const res = await this.#fetchData(`user-profil${this.#apiKey}`);
          const { UserFormPage } = await import("./Form/UserForm.js");

          this.#userForm = new UserFormPage();

          if (res.ok && res.status === 200) {
            this.#userForm.renderProfilForm(
              "profil",
              await res.json(),
            );
            break;
          }

          this.#userForm.renderError({ errorMsg: this.#errorMsg });
          break;
        } catch (_) {
          this.#userForm.renderError({ errorMsg: this.#errorMsg });
          break;
        }
      }

      //============[ BOOKING ]============//
      case this.host + "booking": {
        const { BookingFormPage } = await import("./Form/BookingForm.js");

        this.#bookingForm = new BookingFormPage();
        this.#bookingForm.initForm();
        break;
      }

      //============[ PRODUCT ]============//
      default:
        if (this.route.includes("product")) {
          const { ProductFormPage } = await import("./Form/ProductForm.js");

          this.#productForm = new ProductFormPage();
          this.#productForm.initForm();
        }

        break;
    }
  }

  /**
   * @param {string} route
   */
  #fetchData(route) {
    return fetch(`${this.host}${route}`);
  }
}
