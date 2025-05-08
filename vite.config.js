import { vitePlugin as remix } from "@remix-run/dev";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remix()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app')
    }
  },
  server: {
    host: true,
    port: 8080,
    
  }
});