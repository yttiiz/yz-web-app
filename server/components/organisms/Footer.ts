import { Helper } from "@utils";
import type { ComponentType, FooterType } from "../mod.ts";

const {
  basicItems,
  relatedItems,
}: FooterType = await Helper.convertJsonToObject(
  "/server/data/basics/footer.json",
);

export const Footer: ComponentType = {
  name: "Footer",
  content: `<footer>
    <div class="container">
        <ul>
            ${
    basicItems
      .map((item) => `<li><a href="${item.link}">${item.text}</a></li>`)
      .join("")
  }
        </ul>
        <ul>
            ${
    relatedItems
      .map((item) => `<li><a href="${item.link}">${item.text}</a></li>`)
      .join("")
  }
        </ul>
    </div>
</footer>`,
};
