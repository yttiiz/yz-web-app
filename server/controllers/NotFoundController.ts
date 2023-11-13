import { oak } from "@deps";
import { DefaultController } from "./DefaultController.ts";

export class NotFoundController extends DefaultController {
  constructor() {
    super();
  }

  public async handle404Response(
    ctx: oak.Context,
    status: number,
  ) {
    const body = await this.createHtmlFile(
      ctx,
      {
        id: "data-not-found",
        title: "page inexistante",
      },
    );
    this.response(ctx, body, status);
  }
}
