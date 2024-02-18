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
    isAccordeon,
  }: DashboardDetailsType,
  ) => {
    return `
      <div>
        <h3${isAccordeon ? ` class="accordeon-title"` : ""}>
          ${title}
        </h3>
        <div class="${className}"></div>
        ${isAccordeon
          ?
          (
          `<button type="button" data-open="false">
            <span></span>
          </button>
          `
          )
          : ""
        }
      </div>`
  },
};