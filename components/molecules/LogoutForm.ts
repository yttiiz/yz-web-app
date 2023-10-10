import { ComponentType, OnOffSvg } from "../mod.ts";

export const LogoutForm: ComponentType = {
  name: "LogoutForm",
  content: `
  <div>
    <form action="/logout" method="post">
      <button>
        ${OnOffSvg.content}
      </button>
    </form>
    <span>{{ user-infos }}</span>
  </div>`,
};
