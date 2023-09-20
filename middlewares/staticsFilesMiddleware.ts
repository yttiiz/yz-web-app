import { Context, oak } from '../dependencies/dept.ts';

// deno-lint-ignore ban-types
export const staticsFilesMiddleware = async (ctx: Context, next: Function) => {
    const opts: oak.SendOptions = { root: "" };

    switch(ctx.request.method) {
        case "POST":
            opts.root = Deno.cwd();
            break;

        case "GET":
            opts.root = `${Deno.cwd()}/public`
            break;
    }

    await oak.send(ctx, ctx.request.url.pathname, opts);
    await next();
}