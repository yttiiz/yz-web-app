import { DefaultController } from "./DefaultController.ts";
import type { PathAppType, RouterContextAppType } from "./mod.ts";

export class NotFoundController extends DefaultController {
  constructor() {
    super();
  }

  public async handle404Response(
    path: PathAppType,
    ctx: RouterContextAppType<typeof path>,
    status: number,
  ) {
    const body = await this.createHtmlFile(
      ctx,
      "data-not-found",
      "page inexistante"
    );
    this.response(ctx, body, status);
  }
}