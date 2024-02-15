// deno-fmt-ignore-file
import type {
  ComponentType,
  ItemDataType,
  ItemDataTypeAndUserRelationship,
  MoleculeNameType,
} from "../mod.ts";

type ParameterType = {
  isUserConnected: boolean;
  items: ItemDataTypeAndUserRelationship[];
  data: ItemDataType[];
};

export const HeaderNavigation: ComponentType<
  MoleculeNameType,
  (arg: ParameterType) => string
> = {
  name: "HeaderNavigation",
  html: ({
    isUserConnected,
    items,
    data,
  }: ParameterType) => {
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
                        Aka ${subItem.text}
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
