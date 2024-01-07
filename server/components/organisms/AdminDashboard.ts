// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import {
  type ComponentType,
  type OrganismNameType,
 } from "../mod.ts";

 export const AdminDashboard: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "AdminDashboard",
  html: ({
    title,
    users,
    products,
    bookings,
  }) => {
    return `
    <div>
      <h1>${title}</h1>
    </div>
    <div class="admin-dashboard">
      <div class="users-details">
      </div>
      <div class="products-details">
      </div>
      <div class="bookings-details">
      </div>
    </div>
    `;
  }
}