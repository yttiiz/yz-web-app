// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { OnOffSvg, UserSvg } from "../mod.ts";
import type { ComponentType, MoleculeNameType } from "../mod.ts";

export const LogoutUserForm: ComponentType<
  MoleculeNameType,
  (...arg: any[]) => string
> = {
  name: "LogoutUserForm",
  html: (
    userPhoto: string,
    userFullname: string,
  ) => {
    return `
    <div>
      <form action="/logout" method="post">
        <button type="submit" title="déconnexion">
          ${OnOffSvg.html}
        </button>
      </form>
      <span>
        Bonjour <a href=\"/profil\">{{ user-firstname }}</a>
      </span>
      <span>
        <a href=\"/profil\">
        ${userPhoto.includes("default")
          ? UserSvg.html
          : `<img src="${userPhoto}" alt="${userFullname}" />`
        }
        </a>
      </span>
    </div>`
  },
};
