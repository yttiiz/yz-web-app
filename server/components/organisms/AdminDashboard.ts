// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file
import {
DashboardCard,
  type ComponentType,
  type OrganismNameType,
  type DashboardDataType,
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
  }: DashboardDataType,
  ) => {
    return `
    <div>
      <h1>${title}</h1>
    </div>
    <div class="admin-dashboard">
      <div class="card">
        ${DashboardCard.html(users)}
      </div>
      <div class="card">
        ${DashboardCard.html(products)}
      </div>
      <div class="card">
        ${DashboardCard.html(bookings)}
      </div>
    </div>
    `;
  }
}