import { Helper } from "@utils";
import type { ComponentType, HeaderType } from "../mod.ts";

const {
  login,
}: HeaderType = await Helper.convertJsonToObject(
  "/server/data/basics/header.json",
);

export const Login: ComponentType = {
  name: "Login",
  content: `
  <div class="login">
    ${
    login.map((item) => (
      `<a
        href="${item.link}"
        ${item.className ? `class="${item.className}"` : ""}
      >
        ${item.text}
      </a>`
    ))
      .join("")
  }
  </div>`,
};
