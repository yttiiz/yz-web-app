// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { Helper } from "@utils";
import { HeaderNavigation, HeaderUserSession, Logo } from "../mod.ts"
import type { 
  ComponentType,
  HeaderDataType,
  TemplateNameType,
} from "../mod.ts";
import { SessionAndDataType } from "@controllers";

const {
  logo: { link, text },
  items,
}: HeaderDataType = await Helper.convertJsonToObject("/server/data/basics/header.json");

export const Header: ComponentType<
  TemplateNameType,
  (...args: any[]) => string
> = {
  name: "Header",
  html: ({
    session,
    isConnexionFailed,
    isAdminInterface,
  }: SessionAndDataType
  ) => {
    return `
    <header data-header="site">
      <div class="container">
        <div>
          ${isConnexionFailed || isAdminInterface
            ? ""
            :
            (
              `
              <div id="burger">
                <button type="button">
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                ${HeaderNavigation.html(
                  session.has("userFirstname"),
                  items,
                )}
              </div>
              `
            )
          }
          <div id="logo">
            <a href="${link}">
              ${Logo.html}
              <span>${text}</span>
            </a>
          </div>
        </div>
        ${isConnexionFailed
          ? ""
          :
          (
            `
            <div>
              ${HeaderUserSession.html(session)}
            </div>
            `
          )
        }
      </div>
    </header>`
  },
};
