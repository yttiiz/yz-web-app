// deno-fmt-ignore-file
import { Helper } from "@utils";
import { Logo } from "../mod.ts"
import { 
  ComponentType,
  HeaderDataType,
  TemplateNameType,
} from "../mod.ts";

const {
  logo: { link, text },
  items,
}: HeaderDataType = await Helper.convertJsonToObject("/server/data/basics/header.json");

export const Header: ComponentType<TemplateNameType> = {
  name: "Header",
  html: `<header data-header="site">
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
            ${Logo.html}
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
