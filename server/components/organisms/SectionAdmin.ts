// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import { Helper } from "@utils";
import {
  AdminDashboard,
  DeleteForm,
  Dialog,
  DialogForm,
  FormAdmin,
} from "../mod.ts";
import type {
  ComponentType,
  OrganismNameType,
  FormDataType,
  DashboardDataType,
} from "../mod.ts";

export const SectionAdmin: ComponentType<
  OrganismNameType,
  (isUserConnected: boolean) => Promise<string>
> = {
  name: "SectionAdmin",
  html: async (isUserConnected: boolean) => {
    let content: FormDataType | DashboardDataType;
    let userFormContent: any, productFormContent: any, createProductFormContent: any, bookingFormContent: any;

    if (isUserConnected) {
      content = await Helper.convertJsonToObject("/server/data/admin/dashboard.json");
      
      userFormContent = await Helper.convertJsonToObject("/server/data/admin/user-form.json");
      productFormContent = await Helper.convertJsonToObject("/server/data/admin/product-form.json");
      createProductFormContent = await Helper.convertJsonToObject("/server/data/admin/create-product-form.json");
      bookingFormContent = await Helper.convertJsonToObject("/server/data/admin/booking-form.json");
      
    } else {
      content = await Helper.convertJsonToObject("/server/data/authentication/admin.json");
    }

    return `
    <section ${isUserConnected ? `data-admin="connected"` : ""}>
      <div class="container">
        ${isUserConnected
          ? AdminDashboard.html(content)
          : FormAdmin.html(content)
        }
      </div>
    </section>
    ${Dialog.html({ dataset: "profil" })}
    ${isUserConnected
      ? (`
        ${Dialog.html({ dataset: "users", component: DialogForm.html(userFormContent) })}
        ${Dialog.html({ dataset: "products", component: DialogForm.html(productFormContent) })}
        ${Dialog.html({ dataset: "create-product", component: DialogForm.html(createProductFormContent) })}
        ${Dialog.html({ dataset: "bookings", component: DialogForm.html(bookingFormContent) })}
        ${Dialog.html({ dataset: "response" })}
        ${Dialog.html({ dataset: "delete", component: DeleteForm.html })}
        `) 
      : ""}
    `;
  },
};
