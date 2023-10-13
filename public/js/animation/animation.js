export const handleBurger = () => {
  const toggleElementClasslist = (lines, nav, i = 0) => {
    for (const line of lines) {
      line.classList.toggle(`line-${i + 1}`);
      i++;
    }

    nav.classList.toggle("none");
  };

  /** @param {Event} e **/
  const burgerHandler = (e) => {
    const lines = e.currentTarget.querySelectorAll("button > span");
    const nav = e.currentTarget.querySelector("nav");

    toggleElementClasslist(lines, nav);
  };

  /** @param {Event} e **/
  const windowHandler = (e) => {
    const lines = document.querySelectorAll("#burger > button > span");
    const nav = document.querySelector("#burger > nav");

    if (e.target.closest("#burger")) {
      return;
    } else if (!nav.classList.contains("none")) {
      toggleElementClasslist(lines, nav);
    }
  };

  document.querySelector("#burger")
    .addEventListener("click", burgerHandler);
  window.addEventListener("click", windowHandler);
};

export const handleShowPassword = () => {
  const eyeIcons = document.querySelectorAll("#eye-password span");

  /** @param {Event} e **/
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
