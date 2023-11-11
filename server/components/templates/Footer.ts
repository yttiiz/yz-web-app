// deno-fmt-ignore-file
import { Helper } from "@utils";
import type {
  ComponentType,
  FooterDataType,
  TemplateNameType
} from "../mod.ts";

const {
  basicItems,
  relatedItems,
}: FooterDataType = await Helper.convertJsonToObject(
  "/server/data/basics/footer.json",
);

export const Footer: ComponentType<TemplateNameType> = {
  name: "Footer",
  html: `<footer>
    <div class="container">
        <ul>
        ${
          basicItems
            .map((item) => (
              `<li>
                <a href="${item.link}">${item.text}</a>
              </li>`)
            ).join("")
        }
        </ul>
        <ul>
        ${
          relatedItems
            .map((item) => (
              `<li>
                <a href="${item.link}">${item.text}</a>
              </li>`)
            ).join("")
        }
        </ul>
    </div>
</footer>`,
};