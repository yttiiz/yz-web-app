// deno-fmt-ignore-file
// deno-lint-ignore-file no-explicit-any
import type {
  ComponentType,
  ItemDataType,
  ItemDataTypeAndUserRelationship,
  MoleculeNameType,
} from "../mod.ts";

export const HeaderNavigation: ComponentType<
  MoleculeNameType,
  (...args: any[]) => string
> = {
  name: "HeaderNavigation",
  html: (
    isUserConnected: boolean,
    items: ItemDataTypeAndUserRelationship[],
    data: ItemDataType[],
  ) => {
    return `
    <nav class="none">
      <ul>
        ${items.map((item) => (
        !isUserConnected && item.isRelatedToUser
          ? ""
          :
          ("relatedItems" in item
             ?
             (
              `<li>
                <div>
                  ${item.name}
                  <div class="arrow"></div>
                </div>
                <ul class="none">
                  ${data.map((subItem) => (
                    `<li>
                      <a href="${subItem.link}">
                        ${subItem.text}
                      </a>
                    </li>`
                  )).join("")}
                </ul>
              </li>`
             )
            :
            (
              `<li>
                <a href="${item.link}">
                  ${item.text}
                </a>
              </li>`
            )
          )
        )).join("")}
      </ul>
    </nav>
    `
  },
};
