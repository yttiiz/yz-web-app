/**
 * Switchs between `eye-open` and `eye-shut` svg.
 */
const handleShowPassword = () => {
  const eyeIcons = document.querySelectorAll("#eye-password span");

  /** @param {Event} e **/
  const handler = (e) => {
    // handle eye icon
    e.currentTarget.closest("div")
      .querySelector(".none")
      .classList.remove("none");

    e.currentTarget.classList.add("none");

    // handle input type
    const input = e.currentTarget.closest("div")
      .previousElementSibling;

    input["type"] === "password"
      ? input["type"] = "text"
      : input["type"] = "password";
  };

  for (const eye of eyeIcons) {
    eye.addEventListener("click", handler);
  }
};

/**
 * @param {Event} e 
 */
const handleInputFile = (e) => {
  /** @type {HTMLInputElement} */
  let input;

  /** @type {HTMLInputElement| HTMLDivElement} */
  let showFileInfos;

  /**
   * @param {HTMLInputElement} input 
   */
  const createInputTypeFile = (input) => {
    input = document.createElement("input");
    input.type = "file";
    input.name = "photo";
    input.accept = ".png, .jpg, .webp, .jpeg";

    return input;
  };

  /**
   * @param {HTMLInputElement} input
   * @param {HTMLInputElement| HTMLDivElement} showFileInfos
   */
  const handleFileContent = (input, showFileInfos) => {
    input.addEventListener("change", (event) => {
      if (event.currentTarget.files.length === 1) {
        const { name, size } = event.currentTarget.files[0];
        const sizeInKo = new Intl.NumberFormat("fr-FR", {
          maximumFractionDigits: 2,
        }).format(size / 1000);

        if (showFileInfos instanceof HTMLDivElement) {
          showFileInfos.innerHTML = `Fichier choisi : <b>${name}</b> (taille: ${sizeInKo} ko).`;

          if (showFileInfos.classList.contains("none")) {
            showFileInfos.classList.remove("none");
            showFileInfos.classList.add("show-file");
          }
        } else {
          showFileInfos.value = `${name} (taille: ${sizeInKo} ko)`;
        }
      }
    });
  };

  // Check if it's Profil or Register form.
  e.currentTarget.closest("form").action.includes("/profil")
    ? showFileInfos = e.currentTarget.nextElementSibling
    : showFileInfos = e.currentTarget.closest("div").previousElementSibling;
  
  if (e.currentTarget.parentNode.querySelector("input")) {
    input = e.currentTarget.parentNode.querySelector("input");
  } else {
    input = createInputTypeFile(input);
    e.currentTarget.closest("div").insertBefore(input, e.currentTarget);
    handleFileContent(input, showFileInfos);
  }

  input.click();
};

/**
 * @param {HTMLFormElement} form
 */
const setFormData = (form) => {
  const formData = new FormData(form);

  for (const [key, value] of formData) {
    // Check for file (image) field or input named 'text-file'.
    if (
      (typeof value === "object" && value.size === 0) ||
      key === "file-text"
    ) {
      formData.delete(key);
    }
  }

  return formData;
};

/**
 * @param {NodeListOf<HTMLLabelElement>} labels
 */
const removeInputsValues = (labels) => {
  for (let i = 0; i < labels.length - 1; i++) {
    labels[i].querySelector("textarea")
      ? labels[i].querySelector("textarea").value = ""
      : null;

    labels[i].querySelector("input")
      ? labels[i].querySelector("input").value = ""
      : null;
  }
};

export {
  handleShowPassword,
  handleInputFile,
  setFormData,
  removeInputsValues,
};