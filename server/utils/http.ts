import type { ContentHeadersType } from "./mod.ts";
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
    if (this.ctx.response.writable) {
      this.ctx.response.body = data;
      this.ctx.response.status = status;
      
    } else {
      //TODO handle error when response it's not writable.
    }

    return this;
  }

  public redirect(url: URL) {
    this.ctx.response.redirect(url);
    return this;
  }
}
