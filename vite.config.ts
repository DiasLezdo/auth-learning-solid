import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';
import suidPlugin from "@suid/vite-plugin";

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    suidPlugin(),
    solidPlugin(),
  ],
  server: {
    port: 3500,
  },
  build: {
    target: 'esnext',
  },
});
