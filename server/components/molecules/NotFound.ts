import { Helper } from "@utils";
import type {
  ComponentType,
  MoleculeNameType,
  NotFoundDataType,
} from "../mod.ts";

const {
  title,
  paragraph,
  btnLink,
  btnText,
}: NotFoundDataType = await Helper.convertJsonToObject(
  "/server/data/404/not.found.json",
);

export const NotFound: ComponentType<MoleculeNameType> = {
  name: "NotFound",
  html: `
  <div>
    <h1>${title}</h1>
    <p>${paragraph}</p>
  </div>
  <div>
    <a href="${btnLink}">${btnText}</a>
  </div>`,
};
