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
    const [userList] = AdminContentHelper.#builder.createHTMLElements("ul");
    
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

      /** @type {[HTMLDivElement, HTMLDivElement, ...Types.UserCardDivDetails]} */
      const [
        userPublicPartInfo,
        figure,
        img,
        firstname,
        lastname,
        job,
        age
      ] = AdminContentHelper.#builder.createHTMLElements(
        "div", "figure","img", "p", "p", "p", "p",
      );

      img.src = users[key].photo;
      img.alt = `photo de ${users[key].firstname} ${users[key].lastname}`;

      firstname.innerHTML = `Prénom : <strong>${users[key].firstname}</strong>`;
      lastname.innerHTML = `Nom : <strong>${users[key].lastname}</strong>`;
      age.innerHTML = `Age : <strong>${getAge(users[key].birth)} ans</strong>`;
      job.innerHTML = `Profession : <strong>${users[key].job}</strong>`;

      AdminContentHelper.#builder.insertChildren(figure, img);
      AdminContentHelper.#builder.insertChildren(userPublicPartInfo, firstname, lastname, job, age);
      AdminContentHelper.#builder.insertChildren(userPublicPart, figure, userPublicPartInfo);

      // Set private part.

      const [
        userPrivatePartInfo,
        email,
        role,
        form,
      ] = AdminContentHelper.#builder.createHTMLElements(
        "div",
        "p",
        "p",
        "form",
      );

      email.innerHTML = `Email : <strong>${users[key].email}</strong>`;
      role.innerHTML = `Role : <strong>${users[key].role}</strong>`;
      form.innerHTML = `<button type="submit">Supprimer</button>`;

      form.setAttribute("action", "/delete");
      form.setAttribute("method", "post");
      AdminContentHelper.#builder.insertChildren(userPrivatePartInfo, email, role);
      AdminContentHelper.#builder.insertChildren(userPrivatePart, userPrivatePartInfo, form);

      // Insert main elements into root element.

      AdminContentHelper.#builder.insertChildren(userContainer, userPublicPart, userPrivatePart);
      AdminContentHelper.#builder.insertChildren(userList, userContainer);
    }

    AdminContentHelper.#builder.insertChildren(
      usersDetailsContainer,
      userList,
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