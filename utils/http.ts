import { ContentHeadersType } from "@utils";
import { RouterContextAppType } from "@controllers";

export class Http {
  static setHeaders<T extends string>(
    ctx: RouterContextAppType<T>,
    ...content: ContentHeadersType[]
  ) {
    for (const { name, value } of content) {
      ctx.response.headers.append(name, value);
    }
  }
}
