import { oak } from "@deps";
import {
  NotFoundController,
  PathAppType,
  RouterContextAppType,
} from "@controllers";

export const notFoundMiddleware = async (
  ctx: oak.Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (error) {
    const path = ctx.request.url.pathname;

    new NotFoundController()
      .handle404Response(
        path as PathAppType,
        ctx as RouterContextAppType<PathAppType>,
        error.status,
      );
  }
};
