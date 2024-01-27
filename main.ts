import { load, oak, Session } from "@deps";
import { notFoundMiddleware, staticsFilesMiddleware } from "@middlewares";
import { Mongo } from "@mongo";
import { router } from "@router";
import type { AppState } from "@utils";

type MiddlewareAppType = oak.Middleware<
  AppState,
  oak.Context<AppState, AppState>
>;

const { Application } = oak;

const app = new Application<AppState>();
const env = await load();

// Set environnement variables from '.env' file.
Object.keys(env)
  .map((key) => Deno.env.set(key, env[key]));

const {
  PORT,
  HOST: hostname,
  DATABASE_URL,
  APP_SESSION_NAME,
} = Deno.env.toObject();

// Set session store.
const store = await Mongo.setStore(DATABASE_URL);
const sessionOpts = {
  expireAfterSeconds: 7 * 24 * 60 * 60,
  sessionCookieName: APP_SESSION_NAME,
};

// Set Middlewares.
app.use(Session.initMiddleware(store, sessionOpts) as unknown as MiddlewareAppType);
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
