import { Helper } from "@utils";
import {
UserSvg,
  type ComponentType,
  type HeaderDataType,
  type MoleculeNameType,
  LoginRegister,
} from "../mod.ts";
import { Dialog } from "@/server/components/molecules/Dialog.ts";

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
  </div>
  <div class="login-mobile">
    <button type="button" data-modal="connexion">
      ${UserSvg.html}
    </button>
    ${Dialog.html({ component: LoginRegister.html })}
  </div>`,
};
