export class AnimationHelper {
  constructor() {
    this.#handleBurger();
    this.#handleShowPassword();
  }

  handleProductSlider(sliderClassName) {
    const sliderContainer = document.querySelector(sliderClassName);
    const slider = sliderContainer.querySelector("figure");
    const sliderLength = slider.children.length;
    let index = 0;

    /**
     * @param {Event} e
     */
    const handleMotion = (e) => {
      const container = e.currentTarget;
      const width = container.clientWidth;
      const { x } = container.getBoundingClientRect();

      const isRightClick = (e.clientX - x) >= (width / 2);

      if (isRightClick) {
        if (index >= (sliderLength - 1)) return;

        index++;
        this.#moveSlider(slider, sliderLength, index);
      } else {
        if (index <= 0) return;

        index--;
        this.#moveSlider(slider, sliderLength, index);
      }
    };

    sliderContainer.addEventListener("click", handleMotion);
  }

  /**
   * Animates slider motion.
   * @param {string} sliderClassName
   */
  handleHomeSlider(sliderClassName) {
    const sliders = document.querySelectorAll(sliderClassName);

    /**
     * @param {{
     *  prevBtn: HTMLButtonElement;
     *  nextBtn: HTMLButtonElement;
     *  sliderLength: number;
     *  index: number;
     * }} param0
     * @param {string} className
     */
    const changeBtnsVisibility = ({
      prevBtn,
      nextBtn,
      sliderLength,
      index,
    }) => {
      const className = "hidden";

      switch (index) {
        case 0:
          prevBtn.classList.add(className);

          if (nextBtn.classList.contains(className)) {
            nextBtn.classList.remove(className);
          }
          break;

        case sliderLength - 1:
          nextBtn.classList.add(className);

          if (prevBtn.classList.contains(className)) {
            prevBtn.classList.remove(className);
          }
          break;

        default:
          if (prevBtn.classList.contains(className)) {
            prevBtn.classList.remove(className);
          }

          if (nextBtn.classList.contains(className)) {
            nextBtn.classList.remove(className);
          }
      }
    };

    /**
     * @param {HTMLUListElement} landmarks
     * @param {number} index
     * @param {number} key
     */
    const switchActiveLandmark = (
      landmarks,
      index,
      key = 0,
    ) => {
      for (const landmark of landmarks.children) {
        if (index === key) {
          landmark.classList.add("active");
        }

        if (index !== key && landmark.classList.contains("active")) {
          landmark.classList.remove("active");
        }
        key++;
      }
    };

    for (const slider of sliders) {
      const sliderLength = slider.children.length;
      const [prevBtn, nextBtn] = slider.closest("div")
        .querySelectorAll("button");
      const landmarks = slider.closest("div").querySelector("ul");

      let index = 0;

      // Check slider length to display or not buttons and landmarks.
      if (sliderLength === 1) {
        nextBtn.classList.add("hidden");
      } else {
        for (let i = 0; i < sliderLength; i++) {
          landmarks.appendChild(document.createElement("span"));

          i === 0 ? landmarks.children[i].classList.add("active") : null;
        }

        prevBtn.addEventListener("click", () => {
          if (index <= 0) return;

          index--;
          this.#moveSlider(slider, sliderLength, index);
          changeBtnsVisibility({ prevBtn, nextBtn, sliderLength, index });
          switchActiveLandmark(landmarks, index);
        });

        nextBtn.addEventListener("click", () => {
          if (index >= (sliderLength - 1)) return;

          index++;
          this.#moveSlider(slider, sliderLength, index);
          changeBtnsVisibility({ prevBtn, nextBtn, sliderLength, index });
          switchActiveLandmark(landmarks, index);
        });
      }
    }

    return this;
  }

  /**
   * Toogle menu on click on burger button.
   */
  #handleBurger = () => {
    /**
     * @param {NodeListOf<HTMLSpanElement>} lines
     * @param {HTMLDivElement} nav
     * @param {number} i
     */
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

    if (document.querySelector("#burger")) {
      document.querySelector("#burger")
        .addEventListener("click", burgerHandler);
      // deno-lint-ignore no-window-prefix
      window.addEventListener("click", windowHandler);
    }
  };

  /**
   * Switchs between `eye-open` and `eye-shut` svg.
   */
  #handleShowPassword = () => {
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
   * @param {HTMLDivElement} slider
   * @param {number} sliderLength
   * @param {number} index
   */
  #moveSlider = (slider, sliderLength, index) => {
    const slideWidth = slider.clientWidth / sliderLength;
    slider.style.transform = `translateX(-${slideWidth * index}px)`;
  };
}
