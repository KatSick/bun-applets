import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { buildApp } from "./web/setup";

const APP = "web";

const webApp = await buildApp(APP);

const app = new Elysia()
  .use(staticPlugin())
  .get("/user", () => ({ elysia: "Hello Elysia" }))
  .get(`/${APP}`, ({ set }) => webApp.html(set))
  .get(`/${APP}/*`, async ({ params, set }) => {
    console.log(`[${APP}] request>>>`, params["*"], webApp.dir);
    const f = Bun.file(`${webApp.dir}/${params["*"]}`);

    if (await f.exists()) {
      return f;
    }

    return webApp.html(set);
  })
  .listen(3000);

console.log("Started");

export type Server = typeof app;
