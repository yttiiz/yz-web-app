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

export {
  handleShowPassword,
};