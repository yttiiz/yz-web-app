import { Helper } from "@utils";
import { ComponentType, HeaderType } from "./mod.ts";

const {
  logo: { link, text },
  items,
}: HeaderType = await Helper.convertJsonToObject("/data/basics/header.json");

export const Header: ComponentType = {
  name: "Header",
  content: `<header>
    <div class="container">
      <div id="logo">
        <a href="${link}">${text}</a>
      </div>
      <div>
      <div id="user-session">
        {{ application-session }}
      </div>
        <div id="burger">
          <button>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav class="none">
            <ul>
              ${
    items
      .map((item) => (
        `<li>
                  <a href="${item.link}">
                    ${item.text}
                  </a>
                </li>`
      ))
      .join("")
  }
            </ul>
          </nav> 
        </div>
      </div>
    </div>
</header>`,
};
