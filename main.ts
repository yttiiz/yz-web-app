import { load, oak, Session } from "@deps";
import { notFoundMiddleware, staticsFilesMiddleware } from "@middlewares";
import { Mongo } from "@mongo";
import { router } from "@router";
import type { AppState } from "@utils";

let app: oak.Application | oak.Application<AppState>;

//Init main classes.
const { Application } = oak;
const store = await Mongo.setStore();

// Set environnement variables from '.env' file.
const env = await load();
Object.keys(env)
  .map((key) => Deno.env.set(key, env[key]));
  
// Set session store (if defined).
if (store) {
  type MiddlewareAppType = oak.Middleware<
    AppState,
    oak.Context<AppState, AppState>
  >;

  app = new Application<AppState>();
  (app as oak.Application<AppState>)
  .use(Session.initMiddleware(store) as unknown as MiddlewareAppType);

} else {
  app = new Application();
}

const { PORT, HOST: hostname } = Deno.env.toObject();

// Set Middlewares.
app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFoundMiddleware);
app.use(staticsFilesMiddleware);

app.listen({ port: +PORT, hostname });
app.addEventListener("listen", ({
  hostname,
  port,
  secure,
}) => {
  console.log(`
    ++++++++++++++++++++++++++++++++++++++++
    Server listening on ${secure ? "https" : "http"}://${hostname}:${port}
    Welcome to my Deno Application !!
    ++++++++++++++++++++++++++++++++++++++++
    `);
});
