import type { Context } from "elysia";
import { watch } from "fs";
import { dirname } from "path";
import { renderToString } from "react-dom/server";

export const buildReactFrontend = async (dir: string, route: string) => {
  const html = renderToString(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{route}</title>
      </head>
      <body />
      <script src={`/${route}/index.js`} />
    </html>,
  );

  const build = () =>
    Bun.build({
      root: dir,
      entrypoints: [`${dir}/index.tsx`],
      outdir: `./dist/${route}`,
      minify: false,
      target: "browser",
      // bun bug: see https://github.com/oven-sh/bun/issues/7888
      // sourcemap: "inline",
      format: "esm",
      publicPath: `/${route}/`,
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    });

  watch(dir, { recursive: true }, () => build());

  const entrypoint = (await build()).outputs.filter((out) => out.kind === "entry-point")[0];

  return {
    dir: dirname(entrypoint.path),
    html: (set: Context["set"]) => {
      set.headers["Content-Type"] = "text/html; charset=utf8";

      return html;
    },
  };
};
