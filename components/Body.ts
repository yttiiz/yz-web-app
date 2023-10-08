import { Helper } from "@utils";
import type { ComponentType, PageType } from "./mod.ts";

const {
  title,
  description,
}: PageType = await Helper.convertJsonToObject("/data/basics/app.json");

export const Body: ComponentType = {
  name: "Body",
  content: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <meta name="description" content="${description}">
      <link rel="stylesheet" href="./css/style.css">
      <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon">
    </head>
    <body>
      {{ application-content }}
    <script type="module" src="./js/index.js"></script>
    </body>
    </html>`,
};
