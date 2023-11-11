# ![favicon](./public/favicon.svg) Deno application
This application is designed as a **craft-app**. The idea here, is to experiment the `deno` ecosystem, using a non conventional architecture.

### Specifications
* **Language** : [Typescript](https://www.typescriptlang.org/) | [Javascript](https://tc39.es/ecma262/)
* **Runtime** : [deno](https://deno.com/)
* **Framework** : [oak](https://deno.land/x/oak@v12.6.1)
* **Database** : [mongodb](https://www.mongodb.com/)

The application configuration is define in the `deno.json` file. It's the ID card of the project, where alias to the main folders, compiler options and dependencies import are set.


## How does it works ?
First of all, you have to create a `.env` file, to set your **environnement variables**. Check the `.env.example` file to identify the necessary keys you have to set :

```
APP_ENV="local"
PORT=3000
HOST=127.0.0.1
APP_URL="http://127.0.0.1:3000"
DATABASE_URL="your/database/url"
```
Then, you can start working with the applicatiton by running this command :

```sh
deno task start
```
It run the server with the flags `--allow-write` `--allow-read` `--allow-net`, which allow you to write files, read files and connect to the internet.

## What is the architecture ?
### Server side :
* `main.ts` creates the **oak.Application** with the **_MongoDB_** _Session_ middleware, the router routes and the static files middleware.
* After been created, the router, is injected into every **controllers**.
* The **default controller** manage the html rendering and the implementation of the responses (based on a [http](./server/utils/http.ts) instance). The others controllers, except the ApiController, inherit from its `prototype`.
* The mongo folder implements a **static class** to manage the connexion with the DB.
* The application **static text contents** is driven by the json files in the [data](./server/data/) folder.

### Client side :
* The basics **css**, **img**, **js** folders, request by the client on every route.


## Is the app has tests ?
**There's no test here**. You can trust in you ! 😊