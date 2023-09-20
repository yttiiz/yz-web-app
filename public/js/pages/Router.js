// deno-lint-ignore-file
import { HomePage, LoginPage, RegisterPage } from "./mod.js";

export class Router {
    #home
    #login
    #register

    constructor(route) {
        this.route = route
        this.host = 'http://127.0.0.1:3000/'
        this.#home = new HomePage
        this.#login = new LoginPage
        this.#register = new RegisterPage
        this.#router()
    }
    
    async #router() {
        switch(this.route) {
            case this.host: {
                const res = await this.#fetchData('api');

                if (res.ok && res.status === 200) {
                    const users = await res.json();
                    this.#home.renderUsers(users);
                    break;
                }
    
                this.#home.renderError(res.status);
                break;
            }

            case this.host + "register": {
                const res = await this.#fetchData('register-data')

                if (res.ok && res.status === 200) {
                    const data = await res.json();

                    this.#register.renderForm(data, `${this.host}register`);
                    break;
                }
            }

            case this.host + "login": {
                const res = await this.#fetchData('login-data')

                if (res.ok && res.status === 200) {
                    const data = await res.json();

                    this.#login.renderForm(data, `${this.host}login`);
                    break;
                }
            }
        }
    }

    async #fetchData(route) {
        return fetch(`${this.host}${route}`)
    }
}