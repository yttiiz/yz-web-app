import * as layers from "@components";
import {
  AuthPathType,
  PageDataIdType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";
import { Helper } from "@utils";

export class DefaultController {
  router;

  constructor(router: RouterAppType) {
    this.router = router;
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
    data: unknown,
    redirect?: string,
  ) {
    if (redirect) {
      const url = new URL(redirect, Deno.env.get("APP_URL"));
      ctx.response.redirect(url);
    } else {
      ctx.response.status = 200;
    }

    typeof data === "string"
      ? ctx.response.body = data
      : ctx.response.body = JSON.stringify(data);

    console.log(ctx.response);
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
      const data = await Helper.convertJsonToObject(`/data${path}.json`);
      main = main.replace("{{ content-insertion }}", this.createForm(data));
    } else {
      main = main.replace("{{ content-insertion }}", "");
    }

    const content = "\n" + header + "\n" + main + "\n" + footer + "\n";
    page = page.replace("{{ application-content }}", content);

    return page;
  }
}
