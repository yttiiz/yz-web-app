import * as Types from "../types/types.js";

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
 * @param {string} [name]
 */
const handleInputFile = (e, name) => {
  /** @type {HTMLInputElement} */
  let input;

  /** @type {HTMLInputElement| HTMLDivElement} */
  let showFileInfos;

  /**
   * @param {HTMLInputElement} input 
   */
  const createInputTypeFile = (input, fileName = "photo") => {
    input = document.createElement("input");
    input.type = "file";
    input.name = fileName;
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
    input = name ? createInputTypeFile(input, name) : createInputTypeFile(input);
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

/**
 * @param {HTMLInputElement} element 
 * @param {Record<string, string>} data 
 */
const hydrateInput = (element, data) => {
  const isValueStringOrNumber = (
    typeof data[element.name] === "string" || typeof data[element.name] === "number"
  );
  
  if (element.type !== "password" && isValueStringOrNumber) {
    element.type === "date"
      ? element.value = data[element.name].split("T").at(0)
      : element.value = data[element.name];
  }
};

/**
 * @param {HTMLSelectElement} element 
 * @param {Record<string, string>} data 
 */
const hydrateSelect = (element, data) => {
  for (const option of element.children) {
    if (option.value == data[element.name]) {
      option.setAttribute("selected", true);
      break;
    }
  }
};

/**
 * Inserts an `img` element and a `figure` before each input related to pictures.
 * @param {HTMLDialogElement} dialog 
 */
const insertPictureIn = (dialog) => {
  const form = dialog.querySelector("form");
  const inputThumbnail = form.querySelector("input[name=\"thumbnail-file\"]");
  const inputPictures = form.querySelector("input[name=\"pictures-file\"]");
  const buttons = form.querySelectorAll("label button");

  const img = document.createElement("img");
  img.setAttribute("data-name", "thumbnail");
  
  const figure = document.createElement("figure");
  figure.setAttribute("data-name", "pictures");

  inputThumbnail.closest("label").appendChild(img);
  inputPictures.closest("label").appendChild(figure);

  // Add handle search picture listener to buttons.
  const names = ["thumbnail", "pictures"];
  
  for (let i = 0; i <= buttons.length - 1; i++) {
    buttons[i].addEventListener("click", (e) => handleInputFile(e, names[i]));
  }
};

/**
 * Fills `img` in dialog.
 * @param {Types.Product} data 
 * @param {HTMLDialogElement} dialog 
 */
const fillImgs = (data, dialog) => {
    // Set main image.
    if (dialog.querySelector("form > label > img")) {
      const img = dialog.querySelector("form > label > img");
      const { src, alt } = data[img.dataset.name];
  
      img.src = src; img.alt = alt;
    }
  
    // Set all figure images.
    if (dialog.querySelector("form > label > figure")) {
      const figure = dialog.querySelector("form > label > figure");
  
      if (figure.children.length > 0) {
        figure.innerHTML = "";
      }
  
      for (const item of data[figure.dataset.name]) {
        const imgContainer = document.createElement("div");
        const { src, alt } = item;
  
        imgContainer.innerHTML = `<img src="${src}" alt="${alt}" /><button title="supprimer"><span></span><span></span></button>`;
  
        figure.appendChild(imgContainer);
      }
    }
};

/**
 * @param {Types.User | Types.Product | Types.BookingsRegistred & { productName: string }} data 
 * @param {HTMLDialogElement} dialog 
 * @param {(data: Types.Product, dialog: HTMLDialogElement) => void} [fillImgs] 
 */
const insertData = (data, dialog, fillImgs) => {
  const labels = dialog.querySelector("form").querySelectorAll("label");
  
  for (const label of labels) {
    if (label.querySelector("input")) {
      const input = label.querySelector("input");
      hydrateInput(input, data);
    }

    if (label.querySelector("textarea")) {
      const textarea = label.querySelector("textarea");
      hydrateInput(textarea, data);
    }

    if (label.querySelector("select")) {
      const select = label.querySelector("select");
      hydrateSelect(select, data);
    }
  }

  fillImgs ? fillImgs(data, dialog) : null;
};

/**
 * @param {HTMLDivElement} container 
 * @param {string} dataType 
 * @param {Types.Users | Types.Products | Types.BookingsRegistred & { productName: string }} data 
 */
const handleCards = (
  container,
  dataType,
  data,
) => {
  const [
    editBtn,
    deleteBtn
  ] = container.querySelector("div:last-of-type").children;

  // Set listener to 'edit' button.
  editBtn.addEventListener("click", (e) => {
    const dialog = document.querySelector(`dialog[data-${dataType}]`);
    /**
     * Set `form` action to current data.
     * @param {HTMLDialogElement} dialog 
     * @param {string} route 
     * @param {string} id 
     */
    const setFormAction = (dialog, route, id) => {
      dialog.querySelector("form").action = (
        `${location.origin}/${route}/${id}`
      );
    };

    let dataTitle = "";

    // Insert Data.
    for (const key in data) {
      if (dataType !== "bookings") {
        if (data[key]._id === e.currentTarget.dataset.id) {
          
          switch(dataType) {
            case "products": {
              dataTitle = `de l'appartement ${data[key].name}`;
              insertData(data[key], dialog, fillImgs);
              break;
            }
            
            case "users": {
              dataTitle = `du profil de ${data[key].firstname} ${data[key].lastname}`;
              insertData(data[key], dialog);
              break;
            }
          }

          setFormAction(dialog, dataType.slice(0, -1), data[key]._id);
          
          break;
        }
        
      } else {
        
        dataTitle = `de la réservation de ${data.userName}`;
        insertData(data, dialog);
        setFormAction(dialog, dataType.slice(0, -1), data._id);
        break;
      }
    }

    // Set modal.
    dialog.querySelector("h2").textContent = `Modification ${dataTitle}`;
    dialog.querySelector("p").innerHTML = "Les modifications apportées seront directement envoyées à la base de données. <b>Soyez bien sûrs des informations que vous renseignés</b>.";

    dialog.showModal();
  });
};

export {
  handleShowPassword,
  handleInputFile,
  hydrateInput,
  setFormData,
  removeInputsValues,
  handleCards,
  insertPictureIn,
};