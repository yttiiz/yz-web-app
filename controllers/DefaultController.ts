// deno-fmt-ignore-file
import * as layers from "@components";
import { Helper, Http } from "@utils";
import { UserSchemaWithIDType } from "@mongo";
import type {
  PathType,
  PageDataIdType,
  RouterAppType,
  InsertIntoDBType,
  SelectFromDBType,
  RouterContextAppType,
} from "./mod.ts";

export class DefaultController {
  router;
  helper;
  public insertIntoDB;
  public selectFromDB;

  constructor(
    router: RouterAppType,
    insertIntoDB?: InsertIntoDBType,
    selectFromDB?: SelectFromDBType,
    ) {
    this.router = router;
    this.helper = Helper;
    insertIntoDB
      ? this.insertIntoDB = insertIntoDB
      : null;
    selectFromDB
      ? this.selectFromDB = selectFromDB
      : null;
  }

  protected response<T extends PathType>(
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
    header = await this.setHeaderHtml(header, ctx);
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

  private createComponents(...args: layers.ComponentNameType[]) {
    const components = [];

    for (const arg of args) {
      components.push(this.file(arg));
    }

    return components;
  }

  private createAuthForm(data: layers.FormType): string {
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
          autocomplete,
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
                  ${autocomplete ? ` autocomplete="${autocomplete}"` : ""}
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

  private createProfilForm(data: layers.FormType): string {
    return `<h1>${data.title}</h1>
    <form
      action="${data.action}"
      method="POST"
      type="multipart/form-data"
    >
      <div>
      </div>
      <input type="${data.content[0].type}" value="${data.content[0].value}"/>
    </form>
    `;
  }

  private setTitle(
    html: string,
    title: string | undefined,
  ): string {
    return title
      ? html = html.replace("</title>", ` - ${title}</title>`)
      : html;
  }

  private async setHeaderHtml<T extends string>(
    header: string,
    ctx: RouterContextAppType<T>,
  ): Promise<string> {
    if (ctx.state.session.has("firstname")) {
      const firstname = await ctx.state.session.get("firstname");

      header = header.replace(
        "{{ application-session }}",
        layers.LogoutForm.content
          .replace(
            "{{ user-infos }}",
            "Bonjour <a href=\"/profil\">" + firstname + "</a>",
          ),
      );
    } else {
      header = header.replace(
        "{{ application-session }}",
        layers.Login.content,
      );
    }

    return header;
  }

  private async setMainHtml(
    main: string,
    path: string | undefined,
    id: string,
  ): Promise<string> {
    main = main.replace("{{ id }}", id);

    // Profil form render check
    if (id === "data-profil-form") {
      const data = await this.helper.convertJsonToObject(`/data/profil/profil.json`);
      return main.replace("{{ content-insertion }}", this.createProfilForm(data));
    }

    // Auth form render check
    if (path) {
      const data = await this.helper.convertJsonToObject(`/data${path}.json`);
      return main.replace("{{ content-insertion }}", this.createAuthForm(data));
    }
    
    return main.replace("{{ content-insertion }}", "");
  }
}
