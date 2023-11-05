import { oak } from "@deps";
import { NotFoundController } from "@controllers";

export const notFoundMiddleware = async (
  ctx: oak.Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (error) {

    new NotFoundController()
      .handle404Response(
        ctx,
        error.status,
      );
  }
};
