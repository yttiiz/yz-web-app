// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import { AdminDashboard, Dialog, FormAdmin } from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  FormDataType,
  DashboardDataType,
} from "../mod.ts";

export const SectionAdmin: ComponentType<
  OrganismNameType,
  (...args: any[]) => Promise<string>
> = {
  name: "SectionAdmin",
  html: async (isUserConnected: boolean) => {
    const content: FormDataType | DashboardDataType = await Helper
      .convertJsonToObject(
        `/server/data/${
          isUserConnected
            ? "admin/dashboard"
            : "authentication/admin"
        }.json`,
      );

    return `
    <section ${isUserConnected ? `data-admin="connected"` : ""}>
      <div class="container">
        ${isUserConnected
          ? AdminDashboard.html(content)
          : FormAdmin.html(content)
        }
      </div>
    </section>
    ${Dialog.html({})}`;
  },
};
