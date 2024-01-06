// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import { OnOffSvg, UserSvg } from "../mod.ts";
import type { ComponentType, MoleculeNameType } from "../mod.ts";

export const LogoutAdminForm: ComponentType<
  MoleculeNameType,
  (...arg: any[]) => string
> = {
  name: "LogoutAdminForm",
  html: (
    userPhoto: string,
    userFullname: string,
  ) => {
    return `
    <div>
      <form action="/admin-logout" method="post">
        <button type="submit" title="déconnexion">
          ${OnOffSvg.html}
        </button>
      </form>
      <span>
        Connecté en tant que <a href=\"/profil\">{{ user-firstname }}</a>
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
