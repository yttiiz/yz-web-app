// deno-fmt-ignore-file
import * as layers from "@components";
import { Helper, Http } from "@utils";
import { UserSchemaWithIDType } from "@mongo";
import type {
  FilesDataType,
  PathAppType,
  PageDataIdType,
  RouterAppType,
  RouterContextAppType,
} from "./mod.ts";

export class DefaultController {
  public router;
  public helper;
  protected errorMsg = "Impossible de se connecter à la base de données. Code erreur : ";
  protected sessionFlashMsg = (email: string) => `connexion réussie pour : ${email}`;

  constructor(router?: RouterAppType) {
    router
      ? this.router = router
      : null;
    this.helper = Helper;
  }

  protected response<T extends PathAppType>(
    ctx: RouterContextAppType<T>,
    data: string | UserSchemaWithIDType | Record<string, string>,
    status: number,
    redirect?: string,
  ) {
    const http = new Http(ctx);

    http.setHeaders({
      name: "Content-Type",
      value: status === 200 || status === 404
        ? "text/html; charset=UTF-8"
        : "application/json",
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
    main = await this.setMainHtml(main, id, path);

    const content = "\n" + header + "\n" + main + "\n" + footer + "\n";
    html = html.replace("{{ application-content }}", content);

    return html;
  }

  protected async fileHandler(
    files: FilesDataType,
    firstname: string,
    lastname: string,
  ) {
    const [file] = files;
    const ext = file.contentType.split("/").at(1) as string;
    const photo =
      `img/users/${firstname.toLowerCase()}_${lastname.toLowerCase()}.${ext}`;

    await Deno.writeFile(`public/${photo}`, file.content as Uint8Array);

    return photo;
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

  private createNotFoundContent(data: layers.NotFoundType): string {
    return `<h1>${data.title}</h1>
    <div>
      <p>${data.paragraph}</p>
      <span>
      <a href="${data.btnLink}">${data.btnText}</a>
      </span>
    <div>`;
  }

  private createAuthForm(data: layers.FormType): string {
    return `<h1>${data.title}</h1>
    <form
      action="${data.action}"
      method="${data.method}"
      type="multipart/form-data"
    >
      ${this.setInputsForm(data.content, false)}
    </form>`;
  }

  private createProfilForm(data: layers.FormType): string {
    return `<h1>${data.title}</h1>
    <form
      action="${data.action}"
      method="${data.method}"
      type="multipart/form-data"
    >
      <div>
        <div class="user-photo">
          <figure>
            <img src="/img/users/default.png" alt="default user image" />
          </figure>
          <button type="button">${data.changePhoto ?? "change"}</button>
        </div>
        <div class="user-infos">
          ${this.setInputsForm(data.content)}
        </div>
      </div>
      <input type="${data.content.at(-1)!.type}" value="${data.content.at(-1)!.value}"/>
    </form>
    `;
  }

  private setTitle(
    html: string,
    title: string | undefined,
  ): string {
    return title
      ? html.replace("</title>", ` - ${title}</title>`)
      : html;
  }

  private async setHeaderHtml<T extends string>(
    header: string,
    ctx: RouterContextAppType<T>,
  ): Promise<string> {
    if (ctx.state.session.has("userFirstname")) {
      const firstname = await ctx.state.session.get("userFirstname");

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
    id: string,
    path: string | undefined,
  ): Promise<string> {
    main = main.replace("{{ id }}", id);

    // Not found render check
    if (id === "data-not-found") {
      const data = await this.helper.convertJsonToObject("/server/data/404/not.found.json");
      return main.replace("{{ content-insertion }}", this.createNotFoundContent(data));
    }

    // Profil form render check
    if (id === "data-profil-form") {
      const data = await this.helper.convertJsonToObject("/server/data/profil/profil.json");
      return main.replace("{{ content-insertion }}", this.createProfilForm(data));
    }

    // Auth form render check
    if (path) {
      const data = await this.helper.convertJsonToObject(`/server/data/authentication${path}.json`);
      return main.replace("{{ content-insertion }}", this.createAuthForm(data));
    }
    
    return main.replace("{{ content-insertion }}", "");
  }

  private setInputsForm(
    content: layers.InputType[],
    isProfilInputs = true
  ) {
    return content
    .map(({ type,
      label,
      name,
      placeholder,
      required,
      minLength,
      maxLength,
      value,
      autocomplete,
    }) => type !== "submit"
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
    : isProfilInputs
    ? ""
    : (
      `<input type="${type}"
        ${value ? ` value="${value}"` : ""}
      >`
    ))
    .join("")
  }
}
