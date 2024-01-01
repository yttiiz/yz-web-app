// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
LogoutForm,
  type ComponentType,
  type MoleculeNameType,
  Login,
} from "../mod.ts";
import { SessionType } from "@controllers";

export const HeaderUserSession: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "HeaderUserSession",
  html: (session: SessionType) => {
    let firstname = "", photo = "", fullname ="";

    if (session && session.has("userFirstname")) {
      firstname = session.get("userFirstname");
      photo = session.get("userPhoto");
      fullname = session.get("userFullname");
    }

    return `
    <div id="user-session">
      ${!session
        ? ""
        : 
        (
          session.has("userFirstname")
          ? (LogoutForm.html(photo, fullname)
            .replace(
              "{{ user-firstname }}",
              firstname,
            ))
          : Login.html
        ) 
      }
    </div>
    `
  },
};