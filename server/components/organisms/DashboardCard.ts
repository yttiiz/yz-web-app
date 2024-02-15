// deno-fmt-ignore-file
import type {
  ComponentType,
  DashboardDetailsType,
  OrganismNameType,
} from "../mod.ts";

export const DashboardCard: ComponentType<
  OrganismNameType,
  (arg: DashboardDetailsType) => string
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
        <button type="button" data-open="false">
          <span></span>
        </button>
      </div>`
  },
};