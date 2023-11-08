import { ComponentType, OnOffSvg, UserSvg } from "../mod.ts";

export const LogoutForm: ComponentType = {
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
