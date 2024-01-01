// deno-fmt-ignore-file
import { oak } from "@deps";
import * as layout from "@components";
import { Helper, Http } from "@utils";
import type {
  PathAppType,
  ConfigPageType,
  RouterAppType,
  RouterContextAppType,
  ConfigMainHtmlType,
  DataResponseType,
  SessionAndDataType,
} from "./mod.ts";

export class DefaultController {
  public router;
  public helper;
  protected MAX_SIZE = 10_000_000;
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
    data: DataResponseType,
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
    const isUserConnected: boolean = ctx.state.session.has("userFirstname");
    const appData = { session: ctx.state.session, data };

    let [html, header, main, footer] = this.createComponents(
      appData,
      "Body",
      "Header",
      "Main",
      "Footer",
    );

    html = this.setTitle(html, title);
    html = this.setCss(html, css);
    main = await this.setMainHtml({ main, id, data, path, isUserConnected });

    const content = "\n" + header + "\n" + main + "\n" + footer + "\n";
    html = html.replace("{{ application-content }}", content);

    return html;
  }

  private createComponents(
    appData: SessionAndDataType,
    ...args: (layout.TemplateNameType | "Body")[]
  ) {
    const components = [];

    for (const arg of args) {
      arg === "Header" || arg === "Footer"
        ? components.push(layout[arg].html(appData))
        : components.push(layout[arg].html);
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

  private async setMainHtml({
    main,
    id,
    data,
    path,
    isUserConnected,
  }: ConfigMainHtmlType): Promise<string> {
    main = main.replace("{{ id }}", id);

    switch(id) {
      // Home rendering.
      case "data-home": {
        if (typeof data === "string") return main.replace(
          "{{ content-insertion }}",
          layout.SectionErrorHome.html(data),
        );

        return main.replace(
          "{{ content-insertion }}",
          await layout.SectionProductsHome.html(data),
        );
      }

      // Product rendering.
      case "data-product": {
        return main.replace(
          "{{ content-insertion }}",
          layout.SectionsProduct.html(
            data,
            isUserConnected,
          ),
        );
      }

      // Booking rendering.
      case "data-booking": {
        return main.replace(
          "{{ content-insertion }}",
          layout.SectionsBooking.html(
            data,
          ),
        );
      }

      // Profil form rendering.
      case "data-profil-form": {
        return main.replace(
          "{{ content-insertion }}",
          layout.SectionsProfilForm.html(),
        );
      }

      // Not found rendering.
      case "data-not-found": {
        return main.replace(
          "{{ content-insertion }}",
          layout.NotFound.html,
        );
      }

      default: {
        // Auth form rendering.
        if (path) {
          return main.replace(
            "{{ content-insertion }}",
            await layout.SectionAuthForm.html(path),
          );
        }
    
        return main.replace("{{ content-insertion }}", "");
      }
    }
  }
}