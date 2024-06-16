import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import vuetify from "vite-plugin-vuetify";

import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [
    vue(),
    mkcert(),
    vuetify({ autoImport: true }), // Enabled by default
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    https: true,
  },
});
