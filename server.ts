import { oak } from "@deps";
import { staticsFilesMiddleware } from "@middlewares";
import { router } from "@router";

const { Application } = oak;
const port = 3000, hostname = "127.0.0.1";

const app = new Application();

//Middlewares
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticsFilesMiddleware);

app.listen({ port, hostname });
app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(`
    ++++++++++++++++++++++++++++++++++++++++
    Server listening on ${secure ? "https" : "http"}://${hostname}:${port}
    Welcome to my Deno Application !!
    ++++++++++++++++++++++++++++++++++++++++
    `);
});
