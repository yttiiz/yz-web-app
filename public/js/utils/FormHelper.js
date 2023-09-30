export class FormHelper {
  static showRegisterDetails = async (response) => {
    const { id, name } = await response.json();
    const container = document.querySelector("#data-users-form");
    const box = document.createElement("div");
    box.textContent = `${name} a été enregistré avec succès sous l'id : ${id}`;
    container.appendChild(box);
  };

  static showLoginDetails = async (response) => {
    const { firstname } = await response.json();
    const h1 = document.querySelector("#data-users-form > h1");
    h1.textContent = "Bienvenue " + firstname;
  };

  static removeInputsValues = (inputs) => {
    for (let i = 0; i < inputs.length - 1; i++) {
      inputs[i].value = "";
    }
  };

  static setFormData = (form) => {
    const formData = new FormData(form);

    for (const [key, value] of formData) {
      //Check for file field.
      if (typeof value === "object" && value.size === 0) {
        formData.delete(key)
      }
    }

    return formData;
  }
}
