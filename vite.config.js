import { fileURLToPath, URL } from "node:url";

import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
