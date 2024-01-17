import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";
import { PageBuilder } from "../../pages/Builder.js";
import * as Types from "../../types/types.js";

export class AdminContentHelper extends DefaultFormHelper {
  static #host = location.origin + "/";
  static #builder = new PageBuilder;

  static initContent = async () => {
    // Retrieve data from api.
    const [users, products, bookings] = await (async function (...args) {
      /** @type {[Types.Users, Types.Products]} */
      const allData = [];

      for (const arg of args) {
        const data = await AdminContentHelper.#getData(arg);
        allData.push(data);
      }

      return allData;
    })("users", "products", "bookings");

    AdminContentHelper.#setUsersCard(users);
  };

  /**
   * @param {Types.Users} users
   */
  static #setUsersCard = (users) => {
    const usersDetailsContainer = document.querySelector(".users-details");
    const [usersList, usersMainInfos] = AdminContentHelper.#builder.createHTMLElements("ul", "div");
    
    const getAge  = (date) => {
      return new Date(Date.now() - new Date(date).getTime())
        .getFullYear() - 1970;
    };

    for (const key in users) {
      /** @type {[HTMLLIElement, HTMLDivElement, HTMLDivElement]} */
      const [
        userContainer,
        userPublicPart,
        userPrivatePart,
      ] = AdminContentHelper.#builder.createHTMLElements(
        "li",
        "div",
        "div",
      );
      
      // Set public part.

      userPublicPart.innerHTML = `
      <figure>
        <img src="${users[key].photo}" alt="photo de ${users[key].firstname} ${users[key].lastname}" /> 
      </figure>
      <div>
        <p>Prénom : <strong>${users[key].firstname}</strong></p>
        <p>Nom : <strong>${users[key].lastname}</strong></p>
        <p>Age : <strong>${getAge(users[key].birth)} ans</strong></p>
        <p>Profession : <strong>${users[key].job}</strong></p>
      </div>`;

      // Set private part.

      userPrivatePart.innerHTML = `
        <div>
          <p>Id : <strong>${users[key]._id}</strong></p>
          <p>Email : <strong>${users[key].email}</strong></p>
          <p>Role : <strong>${users[key].role}</strong></p>
        </div>
        <form
          action="/delete/${users[key]._id}"
          method="post"
        >
          <button type="submit">Supprimer</button>
        </form>`;

      // Insert main elements into root element.

      AdminContentHelper.#builder.insertChildren(userContainer, userPublicPart, userPrivatePart);
      AdminContentHelper.#builder.insertChildren(usersList, userContainer);
    }

    const { usersLength, usersRoleLength } = ((users) => {
      return {
        usersLength: Object.keys(users).length,
        usersRoleLength: Object.keys(users).filter((key) => (
          users[key].role === "user"
        )).length,
      } 
    })(users);

    usersMainInfos.innerHTML = `
    <p>Il y a ${usersLength} utilisateurs, dont ${usersRoleLength} avec le rôle <strong>user</strong>.</p>`;

    AdminContentHelper.#builder.insertChildren(
      usersDetailsContainer,
      usersList,
      usersMainInfos,
    );
  }

  /**
   * @param {string} path 
   */
  static #getData = async (path) => {
    try {
      const res = await fetch(AdminContentHelper.#host + path);

      if (res.ok) {
        return await res.json();
      }

      return { message: "Something went wrong "};
      
    } catch (error) {
      // TODO implements logic here.
    }
  };
}