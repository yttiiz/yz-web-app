import { Helper } from "@utils";
import type {
  ComponentType,
  HeaderDataType,
  MoleculeNameType
} from "../mod.ts";

const {
  login,
}: HeaderDataType = await Helper.convertJsonToObject(
  "/server/data/basics/header.json",
);

export const Login: ComponentType<MoleculeNameType> = {
  name: "Login",
  html: `
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
