// deno-fmt-ignore-file
import * as layers from "@components";
import { Helper, Http } from "@utils";
import { UserSchemaWithIDType } from "@mongo";
import type {
  AuthPathType,
  PageDataIdType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";

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
        .map(({
          type,
          label,
          name,
          placeholder,
          required,
          minLength,
          maxLength,
          value,
        }) =>
          type !== "submit"
            ? (
              `<label>
                <span>${label}</span>
                <input type="${type}"
                  ${name ? ` name="${name}"` : ""}
                  ${placeholder ? ` placeholder="${placeholder}"` : ""}
                  ${required ? ` required` : ""}
                  ${minLength ? ` minLength="${minLength}"` : ""}
                  ${maxLength ? ` maxLength="${maxLength}"` : ""}
                  ${value ? ` value="${value}"` : ""}
                >
              ${type === "password"
                  ? (
                    `<div id="eye-password">
                        <span>${layers.EyeShutSvg.content}</span>
                        <span class="none">${layers.EyeOpenSvg.content}</span>
                      </div>`
                    )
                  : ""}
              </label>`
            )
            : (
              `<input type="${type}"
                ${value ? ` value="${value}"` : ""}
              >`
            ))
        .join("")
    }
    </form>`;
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
      const firstname = await ctx.state.session.get("firstname");

      header = header.replace(
        "{{ application-session }}",
        layers.LogoutForm.content
          .replace(
            "{{ user-infos }}",
            "Bonjour " + firstname,
          ),
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
