// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { Helper } from "@utils";
import type {
  ComponentType,
  FooterDataType,
  TemplateNameType
} from "../mod.ts";
import { SessionAndDataType } from "@controllers";

const {
  basicItems,
  relatedItems,
  copyrights,
}: FooterDataType = await Helper.convertJsonToObject(
  "/server/data/basics/footer.json",
);

export const Footer: ComponentType<
  TemplateNameType,
  (...args: any[]) => string
  > = {
  name: "Footer",
  html: ({
    isConnexionFailed,
  }: SessionAndDataType
  ) => {
  return `<footer>
      <div class="container">
        ${isConnexionFailed
          ? ""
          :
          (
            `
            <div>
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
            `
          )
        }
        <div>
          <span>${copyrights} ${new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>`
  },
};
