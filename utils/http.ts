import type { ContentHeadersType } from "@utils";
import type { RouterContextAppType } from "@controllers";

export class Http<T extends string> {
  private ctx: RouterContextAppType<T>;

  constructor(ctx: RouterContextAppType<T>) {
    this.ctx = ctx;
  }

  public setHeaders(...contents: ContentHeadersType[]) {
    for (const { name, value } of contents) {
      this.ctx.response.headers.append(name, value);
    }
    return this;
  }

  public setResponse(
    data: string,
    status: number,
  ) {
    this.ctx.response.body = data;
    this.ctx.response.status = status;
    return this;
  }

  public redirect(url: URL) {
    this.ctx.response.redirect(url);
    return this;
  }
}
