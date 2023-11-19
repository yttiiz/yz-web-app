// deno-fmt-ignore-file
import { oak } from "@deps";
import * as layout from "@components";
import { Helper, Http } from "@utils";
import { UserSchemaWithIDType } from "@mongo";
import type {
  PathAppType,
  ConfigPageType,
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
    ctx: RouterContextAppType<T> | oak.Context, {
      id,
      css,
      data,
      title,
      path,
    }: ConfigPageType,
  ) {
    let [html, header, main, footer] = this.createComponents(
      "Body",
      "Header",
      "Main",
      "Footer",
    );

    html = this.setTitle(html, title);
    html = this.setCss(html, css);
    header = await this.setHeaderHtml(header, ctx);
    main = await this.setMainHtml(main, id, data, path);

    const content = "\n" + header + "\n" + main + "\n" + footer + "\n";
    html = html.replace("{{ application-content }}", content);

    return html;
  }

  private createComponents(
    ...args: (layout.TemplateNameType | "Body")[]
  ) {
    const components = [];

    for (const arg of args) {
      components.push(layout[arg].html);
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

  private setCss(
    html: string,
    css: string
  ): string {
    return html.replace("{{ css }}", css);
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
    data: unknown,
    path: string | undefined,
  ): Promise<string> {
    main = main.replace("{{ id }}", id);

    // Home rendering.
    if (id === "data-home") {
      return main.replace(
        "{{ content-insertion }}",
        await layout.ProductsHome.html(data),
      );
    }

    // Product rendering.
    if (id === "data-product") {
      return main.replace(
        "{{ content-insertion }}",
        await layout.SectionProduct.html(data),
      );
    }

    // Not found rendering.
    if (id === "data-not-found") {
      return main.replace(
        "{{ content-insertion }}",
        layout.NotFound.html,
        );
    }

    // Profil form rendering.
    if (id === "data-profil-form") {
      return main.replace(
        "{{ content-insertion }}",
        layout.SectionsProfilForm.html()
      );
    }

    // Auth form rendering.
    if (path) {
      return main.replace(
        "{{ content-insertion }}",
        await layout.SectionAuthForm.html(path),
      );
    }

    return main.replace("{{ content-insertion }}", "")
  }
}