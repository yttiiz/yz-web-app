import { Helper } from "@utils";
import type { ComponentType, HeadPageDataType } from "./mod.ts";

const {
  title,
  description,
}: HeadPageDataType = await Helper.convertJsonToObject(
  "/server/data/basics/app.json",
);

export const Body: ComponentType = {
  name: "Body",
  html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <meta name="description" content="${description}">
      <link rel="stylesheet" href="./css/main.css">
      <link rel="stylesheet" href="./css/{{ css }}.css">
      <link rel="icon" href="./img/favicon.svg" type="image/svg+xml">
    </head>
    <body>
      <noscript>
        <h1>
          JavaScript est désactivé sur votre navigateur
        </h1>
        <h4>
          Veuillez activer JavaScript de manière à pouvoir utiliser toutes les fonctionnalités de l'application.
        </h4>
      </noscript>
      {{ application-content }}
      <script type="module" src="./js/index.js"></script>
    </body>
    </html>`,
};
