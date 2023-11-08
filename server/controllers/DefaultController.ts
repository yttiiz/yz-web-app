// deno-fmt-ignore-file
import { oak } from "@deps";
import * as layout from "@components";
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
    ctx: RouterContextAppType<T> | oak.Context,
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
    ctx: RouterContextAppType<T> | oak.Context,
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

  private file(
    kind: layout.TemplateNameType | "Body",
  ): string {
    if (kind === "Body") {
      return layout.Body.html;
    }

    return layout[kind].html;
  }

  private createComponents(
    ...args: (layout.TemplateNameType | "Body")[]
  ) {
    const components = [];

    for (const arg of args) {
      components.push(this.file(arg));
    }

    return components;
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
    ctx: RouterContextAppType<T> | oak.Context,
  ): Promise<string> {
    if (!ctx.state.session) {
      return header.replace(
        "{{ application-session }}",
        "",
      );
    }
    
    if (ctx.state.session.has("userFirstname")) {
      const firstname = await ctx.state.session.get("userFirstname");

      return header.replace(
        "{{ application-session }}",
        layout.LogoutForm.html
          .replace(
            "{{ user-infos }}",
            "Bonjour <a href=\"/profil\">" + firstname + "</a>",
          ),
      );
    }

    return header.replace(
      "{{ application-session }}",
      layout.Login.html,
    );
  }

  private async setMainHtml(
    main: string,
    id: string,
    path: string | undefined,
  ): Promise<string> {
    main = main.replace("{{ id }}", id);

    // Not found render check
    if (id === "data-not-found") {
      return main.replace(
        "{{ content-insertion }}",
        `<section>${layout.NotFound.html}</section>`,
        );
    }

    // Profil form render check
    if (id === "data-profil-form") {
      return main.replace(
        "{{ content-insertion }}",
        layout.SectionsProfilForm.html()
      );
    }

    // Auth form render check
    if (path) {
      return main.replace(
        "{{ content-insertion }}",
        await layout.SectionAuthForm.html(path),
      );
    }
    
    return main.replace("{{ content-insertion }}", "");
  }
}
