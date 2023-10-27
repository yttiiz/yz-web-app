import { ComponentType, OnOffSvg, UserSvg } from "../mod.ts";

export const LogoutForm: ComponentType = {
  name: "LogoutForm",
  content: `
  <div>
    <form action="/logout" method="post">
      <button type="submit" title="déconnexion">
        ${OnOffSvg.content}
      </button>
    </form>
    <span>{{ user-infos }}</span>
    ${UserSvg.content}
  </div>`,
};
