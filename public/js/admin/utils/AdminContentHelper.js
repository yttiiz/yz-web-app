import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";
import { PageBuilder } from "../../pages/Builder.js";
import * as Types from "../../types/types.js";

export class AdminContentHelper extends DefaultFormHelper {
  static #host = location.origin + "/";
  static #builder = new PageBuilder;
  
  static #formatPrice = (price) => new Intl.NumberFormat(
    "fr-FR",
    {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "eur",
    }
  ).format(price);

  static #formatDate = (date) => new Intl.DateTimeFormat(
    "fr-FR",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(new Date(date));

  /**
   * Fetch `users`, `products` & `bookings` data from database. Then hydrates each `div` with class 'cards' to the corresponding data.
   */
  static init = async () => {
    // Retrieve all data from api.
    const [users, products, bookings] = await (async function (...args) {
      /** @type {[Types.Users, Types.Products]} */
      const allData = [];

      for (const arg of args) {
        const data = await AdminContentHelper.#getData(arg);
        allData.push(data);
      }

      return allData;
    })("users", "products", "bookings");

    // Set cards.
    AdminContentHelper.#setUsersCard(users);
    AdminContentHelper.#setProductsCard(products);
    AdminContentHelper.#setBookingsCard(bookings);
    
    // Set animation cards.
    AdminContentHelper.#animCardExpansion();
  }

  /**
   * @param {Types.Users} users
   */
  static #setUsersCard = (users) => {
    const {
      detailsContainer,
      elementsList,
      dbInfos
    } = AdminContentHelper.#getCardMainElements("users");
    
    const getAge  = (date) => {
      return new Date(Date.now() - new Date(date).getTime())
        .getFullYear() - 1970;
    };

    if ("message" in users) {
      return AdminContentHelper.#displayErrorMessage(
        detailsContainer,
        dbInfos,
      );
    }

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

      userPrivatePart.innerHTML = `
        <div>
          <p>Id : <strong>${users[key]._id}</strong></p>
          <p>Email : <strong>${users[key].email}</strong></p>
          <p>Role : <strong>${users[key].role}</strong></p>
        </div>
        ${AdminContentHelper.#getEditOrDeletePart(users[key]._id)}`;

      users[key].role === "admin"
        ? userContainer.classList.add("admin")
        : null;
      
      AdminContentHelper.#builder.insertChildren(userContainer, userPublicPart, userPrivatePart);
      AdminContentHelper.#builder.insertChildren(elementsList, userContainer);
    }

    const { usersCount, usersRoleCount } = ((users) => {
      return {
        usersCount: Object.keys(users).length,
        usersRoleCount: Object.keys(users).filter((key) => (
          users[key].role === "user"
        )).length,
      } 
    })(users);

    dbInfos.innerHTML = `
    <p>Il y a <strong>${usersCount} utilisateurs</strong>, dont <strong>${usersRoleCount}</strong> avec le rôle <strong>user</strong>.</p>`;

    AdminContentHelper.#builder.insertChildren(
      detailsContainer,
      elementsList,
      dbInfos,
    );
  }

  /**
   * @param {Types.Products} products 
   */
  static #setProductsCard = (products) => {
    const {
      detailsContainer,
      elementsList,
      dbInfos,
    } = AdminContentHelper.#getCardMainElements("products");

    if ("message" in products) {
      return AdminContentHelper.#displayErrorMessage(
        detailsContainer,
        dbInfos,
      );
    }

    for (const key in products) {
      const [
        productContainer,
        productPublicPart,
        productPrivatePart,
      ] = AdminContentHelper.#builder.createHTMLElements(
        "li",
        "div",
        "div",
      );

      productPublicPart.innerHTML = `
      <figure>
        <img src="${products[key].thumbnail.src}" alt="${products[key].thumbnail.alt}" />
      </figure>
      <div>
        <p>Nom : <strong>${products[key].name}</strong></p>
        <p>Type : <strong>${products[key].details.type}</strong></p>
        <p>Superficie : <strong>${products[key].details.area} m<sup>2<sup></strong></p>
        <p>Pièces : <strong>${products[key].details.rooms}</strong></p>
      </div>`;

      productPrivatePart.innerHTML = `
      <div>
        <p>Id : <strong>${products[key]._id}</strong></p>
        <p>Prix : <strong>${AdminContentHelper.#formatPrice(products[key].details.price)}</strong></p>
        <p>Description : <strong>${products[key].description}</strong></p>
      </div>
      ${AdminContentHelper.#getEditOrDeletePart(products[key]._id)}`;

      AdminContentHelper.#builder.insertChildren(productContainer, productPublicPart, productPrivatePart);
      AdminContentHelper.#builder.insertChildren(elementsList, productContainer);
    }

    AdminContentHelper.#builder.insertChildren(
      detailsContainer,
      elementsList,
    );
  }

  /**
   * @param {Types.Bookings} bookings 
   */
  static #setBookingsCard = (bookings) => {
    const {
      detailsContainer,
      elementsList,
      dbInfos,
    } = AdminContentHelper.#getCardMainElements("bookings");

    if ("message" in bookings) {
      return AdminContentHelper.#displayErrorMessage(
        detailsContainer,
        dbInfos,
      );
    }

    /**
     * @param {string} startingDate 
     * @param {string} endingDate 
     */
    const bookingState = (startingDate, endingDate) => {
      const start = new Date(startingDate).getTime();
      const end = new Date(endingDate).getTime();
      const now = Date.now();

      return end < now
        ? "terminée"
        : (
            start < now && end >= now
             ? "en cours"
             : "à venir"
          );
    }

    /** @type {(Types.BookingsRegistred & { productName: string })[]} */
    const sortBookings = [];

    for (const key of Object.keys(bookings)) {
      for (const booking of bookings[key].bookings) {
        booking.productName = bookings[key].productName;
        booking._id = bookings[key]._id;
        sortBookings.push(booking);
      }
    }

    sortBookings.sort((a, b) => a.createdAt - b.createdAt);

    for (const booking of sortBookings) {
      const [
        productContainer,
        productPublicPart,
        productPrivatePart,
      ] = AdminContentHelper.#builder.createHTMLElements(
        "li",
        "div",
        "div",
      );

      productPublicPart.innerHTML = `
      <div>
        <p>Appartement : <strong>${booking.productName}</strong></p>
        <p>Réservation passée le : <strong>${AdminContentHelper.#formatDate(booking.createdAt)}</strong></p>
        <p>Par : <strong>${booking.userName}</strong></p>
      </div>`;
        
      productPrivatePart.innerHTML = `
      <div>
        <p>Date de début : <strong>${AdminContentHelper.#formatDate(booking.startingDate)}</strong></p>
        <p>Date de fin : <strong>${AdminContentHelper.#formatDate(booking.endingDate)}</strong></p>
        <p>Etat : <strong>${bookingState(booking.startingDate, booking.endingDate)}</strong></>
      </div>
      ${AdminContentHelper.#getEditOrDeletePart(booking._id)}`;

      AdminContentHelper.#builder.insertChildren(productContainer, productPublicPart, productPrivatePart);
      AdminContentHelper.#builder.insertChildren(elementsList, productContainer);
    }

    AdminContentHelper.#builder.insertChildren(
      detailsContainer,
      elementsList,
    );
  }

  /**
   * @param {string} className
   * @returns {{ detailsContainer: HTMLDivElement, elementsList: HTMLUListElement, dbInfos: HTMLDivElement }}
   */
  static #getCardMainElements = (selector) => {
    const [elementsList, dbInfos] = AdminContentHelper.#builder.createHTMLElements("ul", "div");
    return {
      detailsContainer: document.querySelector(`.${selector}-details`),
      elementsList,
      dbInfos,
    };
  }

  /**
   * @param {HTMLDivElement} root 
   * @param {HTMLDivElement} children 
   */
  static #displayErrorMessage = (root, children) => {
    children.textContent = "Les données sont indisponibles.";
    AdminContentHelper.#builder.insertChildren(
      root,
      children,
    );
  }

  static #animCardExpansion = () => {
    for (const subtitle of document.querySelectorAll(".card h3")) {
      subtitle.addEventListener("click", (e) => {
        const currentBtn = e.currentTarget.parentNode.querySelector("button[data-open]");
        const containerToAnimate = currentBtn.previousElementSibling;
        /**
         * @param {HTMLDivElement} container 
         */
        const stretchOrRetract = (container) => {
          if (container.classList.contains("open")) {
            container.style.maxHeight = 0;

          } else {
            const [elementsList, databaseInfo] = container.children;
  
            const {
              height: elementsListHeight,
              bottom: elementsListBottom,
            } = elementsList.getBoundingClientRect();
  
            if (databaseInfo) {
              const {
                height: databaseInfoHeight,
                bottom: databaseInfoBottom, 
              } = databaseInfo.getBoundingClientRect();
  
              container.style.maxHeight = (
                elementsListHeight + (
                  databaseInfoBottom - elementsListBottom
                ) + databaseInfoHeight) + "px";

              } else {
              container.style.maxHeight = elementsListHeight + "px";
            }
          }
        };

        // Animate button.
        currentBtn.dataset.open === "false" 
          ? currentBtn.dataset.open = "true"
          : currentBtn.dataset.open = "false";
        
        // Animate content.
        if (containerToAnimate.classList.contains("open")) {
          stretchOrRetract(containerToAnimate);
          containerToAnimate.classList.remove("open");

        } else {
          stretchOrRetract(containerToAnimate);
          containerToAnimate.classList.add("open");
        }
      });
    }
  }

  /**
   * @param {string} id 
   */
  static #getEditOrDeletePart = (id) => {
    return `
    <div>
      <button type="button">Editer</button>
      <form
      action="/delete/${id}"
      method="post"
      >
      <button type="submit">Supprimer</button>
      </form>
    </div>
    `;
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
  }
}