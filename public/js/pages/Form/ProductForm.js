import { PageBuilder } from "../Builder.js";
import { DefaultFormHelper } from "../../utils/DefaultFormHelper.js";

export class ProductFormPage extends PageBuilder {
  initForm = (
    id = "product"
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
    this.#handleReviewForm(reviewForm)
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
      })
    }
  }

  /**
   * @param {Event} e 
   */
  #submitHandler = async (e) => {
    e.preventDefault();

    const formData = DefaultFormHelper.setFormData(e.target);
    const productId = location.pathname.replace("/product/", "");
    
    formData.append("id", productId);
    
    const res = await fetch(e.target.action, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      console.log()
      console.log("status :", res.status, "data :", await res.json())
    }
  }
}