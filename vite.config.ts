import md from "unplugin-vue-markdown/vite";
import vue from "@vitejs/plugin-vue";
import trpc from "./trpc/vite-plugin";
import devServer from "@hono/vite-dev-server";
import {pages} from "vike-cloudflare";
import { defineConfig } from "vite";
import vike from "vike/plugin";

export default defineConfig({
  plugins: [vike({}), pages({
    server: {
      kind: "hono",
      entry: "hono-entry.ts",
    },
  }), devServer({
    entry: "hono-entry.ts",

    exclude: [
      /^\/@.+$/,
      /.*\.(ts|tsx|vue)($|\?)/,
      /.*\.(s?css|less)($|\?)/,
      /^\/favicon\.ico$/,
      /.*\.(svg|png)($|\?)/,
      /^\/(public|assets|static)\/.+/,
      /^\/node_modules\/.*/,
    ],

    injectClientScript: false,
  }), trpc(), vue({
    include: [/\.vue$/, /\.md$/],
  }), md({})],
});