import { Helper } from "@utils";
import type { ComponentType, NotFoundType } from "../mod.ts";

const {
  title,
  paragraph,
  btnLink,
  btnText
}: NotFoundType = await Helper.convertJsonToObject(
  "/server/data/404/not.found.json",
);

export const NotFound: ComponentType = {
  name: "NotFound",
  html: `
  <h1>${title}</h1>
  <div>
    <p>${paragraph}</p>
    <span>
    <a href="${btnLink}">${btnText}</a>
    </span>
  <div>`,
};
