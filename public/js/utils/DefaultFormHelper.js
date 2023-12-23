export class DefaultFormHelper {
  constructor() {}

  /**
   * @param {HTMLFormElement} form
   */
  static setFormData = (form) => {
    const formData = new FormData(form);

    for (const [key, value] of formData) {
      // Check for file (image) field.
      if (typeof value === "object" && value.size === 0) {
        formData.delete(key);
      }
    }

    return formData;
  };

  /**
   * @param {NodeListOf<HTMLLabelElement>} labels
   */
  static removeInputsValues = (labels) => {
    for (let i = 0; i < labels.length - 1; i++) {
      labels[i].querySelector("textarea")
        ? labels[i].querySelector("textarea").value = ""
        : null;

      labels[i].querySelector("input")
        ? labels[i].querySelector("input").value = ""
        : null;
    }
  };

  /**
   * @param {{ parent: HTMLDivElement; cssSelector: string; hmtlTag: string; }} param
   */
  static getOrCreateElement = ({
    parent,
    cssSelector,
    hmtlTag,
  }) => {
    /** @type {HTMLParagraphElement} */
    let element;

    if (parent.querySelector(cssSelector)) {
      element = parent.querySelector(cssSelector);
    } else {
      element = document.createElement(hmtlTag);
      parent.appendChild(element);
    }

    return element;
  };
}
