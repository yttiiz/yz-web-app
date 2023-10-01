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
      value: status === 200 ? "text/html; charset=UTF-8" : "application/json",
    });

    data = typeof data === "string" ? data : JSON.stringify(data);

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

  protected async createHtmlFile<T extends string>(
    ctx: RouterContextAppType<T>,
    id: PageDataIdType,
    title?: string,
    path?: string,
  ) {
    let [html, header, main, footer] = this.createComponents(
      "Body",
      "Header",
      "Main",
      "Footer",
    );

    html = this.setTitle(html, title);
    header = await this.setHeaderHtml(ctx, header);
    main = await this.setMainHtml(main, path, id);

    const content = "\n" + header + "\n" + main + "\n" + footer + "\n";
    html = html.replace("{{ application-content }}", content);

    return html;
  }

  private file(kind: layers.ComponentNameType): string {
    if (kind === "Body") {
      return layers.Body.content;
    }

    return layers[kind].content;
  }

  private createForm(data: layers.FormType): string {
    return `<h1>${data.title}</h1>
    <form
      action="${data.action}"
      method="POST"
      type="multipart/form-data"
    >
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
  private setHtmlTagWithContent(
    tag: string,
    content: string
  ) {
    return `<${tag}>${content}</${tag}>`
  }

  private setTitle(
    html: string,
    title: string | undefined,
  ): string {
    return title
      ? html = html.replace("</title>", " " + title + "</title>")
      : html;
  }

  private async setHeaderHtml<T extends string>(
    ctx: RouterContextAppType<T>,
    header: string,
  ): Promise<string> {
    if (ctx.state.session.has("firstname")) {
      const [userSvg] = this.createComponents("UserSvg");
      const firstname = await ctx.state.session.get("firstname");
      
      header = header.replace(
        "{{ application-session }}",
        this.setHtmlTagWithContent(
          "span", 
          `Bonjour ${firstname}`
        ) + userSvg,
      );
    } else {
      header = header.replace("{{ application-session }}", "");
    }

    return header;
  }

  private async setMainHtml(
    main: string,
    path: string | undefined,
    id: string,
  ): Promise<string> {
    main = main.replace("{{ id }}", id);

    //Form render check
    if (path) {
      const data = await this.helper.convertJsonToObject(`/data${path}.json`);
      main = main.replace("{{ content-insertion }}", this.createForm(data));
    } else {
      main = main.replace("{{ content-insertion }}", "");
    }

    return main;
  }
}
