import { PageBuilder } from "../Builder.js";
import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";
import { ProductFormHelper } from "../../utils/ProductFormHelper.js";

export class ProductFormPage extends PageBuilder {
  initForm = (
    id = "product",
  ) => {
    /** @type {HTMLFormElement[]} */
    const forms = document.querySelectorAll(`#data-${id} form`);

    // Init forms submission.
    for (const form of forms) {
      form.addEventListener(
        "submit",
        (e) => this.#submitHandler(e),
      );
    }

    const [bookingForm, reviewForm] = forms;

    this.#handleBookingForm(bookingForm);

    if (reviewForm) {
      this.#handleReviewForm(reviewForm);
    }
  };

  #handleBookingForm = (form) => {
    /** @type {NodeListOf<HTMLInputElement>} */
    const [
      startingDateInput,
      endingDateInput
    ] = form.querySelectorAll("input[type=\"date\"]");

    //Change ending-date input min attribute, according to user selected starting-date.
    startingDateInput.addEventListener("change", (e) => {
      endingDateInput.min = e.target.value;
    });
  }

  /**
   * @param {HTMLFormElement} form
   */
  #handleReviewForm = (form) => {
    for (const input of form.querySelectorAll("input")) {
      input.addEventListener("click", (e) => {
        /** @type {HTMLSpanElement} */
        const currentSpan = e.currentTarget.previousElementSibling;
        /** @type {HTMLDivElement} */
        const labelsContainer = e.currentTarget.closest("div");

        if (!currentSpan.classList.contains("selected")) {
          currentSpan.classList.add("selected");
        }

        for (const label of labelsContainer.querySelectorAll("label")) {
          const searchSpan = label.querySelector("span");

          if (
            searchSpan.classList.contains("selected") &&
            currentSpan.textContent !== searchSpan.textContent
          ) {
            searchSpan.classList.remove("selected");
          }
        }
      });
    }
  };

  /**
   * @param {Event} e
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const formData = DefaultFormHelper.setFormData(e.target);
    const productId = location.pathname.replace("/product/", "");
    const className = e.target.action.replace(location.origin + "/", "");

    formData.append("id", productId);
    formData.append("className", className);

    const res = await fetch(e.target.action, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      DefaultFormHelper.removeInputsValues(e.target.children);
      
      if (className === "booking") {

      } else {
        ProductFormHelper.showProductUserReviewDetails(res);
      }
    }
  };
}
