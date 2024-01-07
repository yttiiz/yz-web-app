// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  DashboardDetailsType,
  OrganismNameType,
} from "../mod.ts";

export const DashboardCard: ComponentType<
  OrganismNameType,
  (...args: any[]) => string
> = {
  name: "DashboardCard",
  html: ({
    title,
    className,
  }: DashboardDetailsType,
  ) => {
    return `
      <div>
        <h3>${title}</h3>
        <div class="${className}"></div>
      </div>`
  },
};