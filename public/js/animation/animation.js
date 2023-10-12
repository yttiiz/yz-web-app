export const handleBurger = () => {
  const burger = document.querySelector("#burger");
  /**
   * @param {Event} e
   * @param {number} i
   */
  const handler = (e, i = 0) => {
    const lines = e.currentTarget.querySelectorAll("button > span");
    const nav = e.currentTarget.querySelector("nav");

    for (const line of lines) {
      line.classList.toggle(`line-${i + 1}`);
      i++;
    }

    nav.classList.toggle("none");
  };

  burger.addEventListener("click", handler);
};

export const handleShowPassword = () => {
  const eyeIcons = document.querySelectorAll("#eye-password span");
  /**
   * @param {Event} e
   */
  const handler = (e) => {
    //handle eye icon
    e.currentTarget.closest("div")
      .querySelector(".none")
      .classList.remove("none");

    e.currentTarget.classList.add("none");

    //handle input type
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
