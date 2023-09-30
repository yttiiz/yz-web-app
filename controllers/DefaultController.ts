import * as layers from "@components";
import {
  AuthPathType,
  PageDataIdType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";
import { Helper, Http } from "@utils";
import { UserSchemaWithIDType } from "@mongo";

export class DefaultController {
  router;
  helper;

  constructor(router: RouterAppType) {
    this.router = router;
    this.helper = Helper;
  }

  private file(kind: layers.ComponentNameType): string {
    if (kind === "Body") {
      return layers.Body.content;
    }

    return layers[kind].content;
  }

  private createForm(data: layers.FormType) {
    return `<h1>${data.title}</h1>
    <form data-error="${data.error.msg}">
      ${
      data.content
        .map((input) => (
          `<input type="${input.type}"
          ${input.name ? ` name="${input.name}"` : ""}
          ${input.placeholder ? ` placeholder="${input.placeholder}"` : ""}
          ${input.required ? ` required` : ""}
          ${input.minLength ? ` minLength="${input.minLength}"` : ""}
          ${input.maxLength ? ` maxLength="${input.maxLength}"` : ""}
          ${input.value ? ` value="${input.value}"` : ""}
        >`
        ))
        .join("")
    }
    </form>`;
  }

  protected createComponents(...args: layers.ComponentNameType[]) {
    const components = [];

    for (const arg of args) {
      components.push(this.file(arg));
    }

    return components;
  }

  protected response<T extends AuthPathType>(
    ctx: RouterContextAppType<T>,
    data: string | UserSchemaWithIDType | Record<string, string>,
    status: number,
    redirect?: string,
  ) {
    const http = new Http(ctx);

    http.setHeaders({
      name: "Content-Type",
      value: status === 200
      ? "text/html; charset=UTF-8"
      : "application/json"
    });

    data = typeof data === "string"
    ? data
    : JSON.stringify(data);

    if (redirect) {
      const url = new URL(redirect, Deno.env.get("APP_URL"));

      http
      .redirect(url)
      .setResponse(data, status);

    } else {
      http
      .setResponse(data, status);
    }
  }

  protected async createHtmlFile(
    id: PageDataIdType,
    title?: string,
    path?: string,
  ) {
    let [page, header, main, footer] = this.createComponents(
      "Body",
      "Header",
      "Main",
      "Footer",
    );

    title ? page = page.replace("</title>", " " + title + "</title>") : null;

    main = main.replace("{{ id }}", id);

    if (path) {
      const data = await this.helper.convertJsonToObject(`/data${path}.json`);
      main = main.replace("{{ content-insertion }}", this.createForm(data));
    } else {
      main = main.replace("{{ content-insertion }}", "");
    }

    const content = "\n" + header + "\n" + main + "\n" + footer + "\n";
    page = page.replace("{{ application-content }}", content);

    return page;
  }
}
