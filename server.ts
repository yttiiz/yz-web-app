import { oak } from "@deps";
import { load } from "env";
import { staticsFilesMiddleware } from "@middlewares";
import { router } from "@router";

const { Application } = oak;

const app = new Application();
const env = await load();

Object.keys(env)
  .map((key) => Deno.env.set(key, env[key]));

//Environnements variables
const { PORT, HOST: hostname } = Deno.env.toObject();

//Middlewares
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticsFilesMiddleware);

app.listen({ port: +PORT, hostname });
app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(`
    ++++++++++++++++++++++++++++++++++++++++
    Server listening on ${secure ? "https" : "http"}://${hostname}:${port}
    Welcome to my Deno Application !!
    ++++++++++++++++++++++++++++++++++++++++
    `);
});
