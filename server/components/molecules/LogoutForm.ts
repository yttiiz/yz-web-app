import { OnOffSvg, UserSvg } from "../mod.ts";
import type { ComponentType, MoleculeNameType } from "../mod.ts";

export const LogoutForm: ComponentType<MoleculeNameType> = {
  name: "LogoutForm",
  html: `
  <div>
    <form action="/logout" method="post">
      <button type="submit" title="déconnexion">
        ${OnOffSvg.html}
      </button>
    </form>
    <span>{{ user-infos }}</span>
    ${UserSvg.html}
  </div>`,
};
