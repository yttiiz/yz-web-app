// deno-fmt-ignore-file
import { Helper } from "@utils";
import { ComponentType, HeaderType, Logo } from "../mod.ts";

const {
  logo: { link, text },
  items,
}: HeaderType = await Helper.convertJsonToObject("/server/data/basics/header.json");

export const Header: ComponentType = {
  name: "Header",
  content: `<header>
    <div class="container">
      <div>
        <div id="burger">
          <button type="button">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav class="none">
            <ul>
            ${items.map((item) => (
            `<li>
              <a href="${item.link}">
                ${item.text}
              </a>
            </li>`))
            .join("")}
          </ul>
        </nav> 
      </div>
        <div id="logo">
          <a href="${link}">
            ${Logo.content}
            <span>${text}</span>
          </a>
        </div>
      </div>
      <div>
        <div id="user-session">
          {{ application-session }}
        </div>
      </div>
    </div>
</header>`,
};