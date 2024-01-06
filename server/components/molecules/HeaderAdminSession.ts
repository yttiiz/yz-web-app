// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import {
  LogoutAdminForm,
  type ComponentType,
  type MoleculeNameType,
} from "../mod.ts";
import { SessionType } from "@controllers";

export const HeaderAdminSession: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "HeaderAdminSession",
  html: (session: SessionType) => {
    let firstname = "", photo = "", fullname = "";

    if (session && session.has("userFirstname")) {
      firstname = session.get("userFirstname");
      photo = session.get("userPhoto");
      fullname = session.get("userFullname");
    }

    return `
    <div id="user-session">
      ${session.has("userFirstname")
          ? (LogoutAdminForm.html(photo, fullname)
            .replace(
              "{{ user-firstname }}",
              firstname,
            ))
          : ""
      }
    </div>
    `
  },
};