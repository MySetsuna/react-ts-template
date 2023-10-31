import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import vitePluginImp from "vite-plugin-imp";
import svgr from "vite-plugin-svgr";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import cssvgPlugin from "vite-plugin-cssvg";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/svg/*.svg",
    }),
    cssvgPlugin({ inlineLimit: 5 }),
    chunkSplitPlugin({
      customSplitting: {
        "base-vendor": [/lodash/, /router/, /react-query/],
      },
    }),
    vitePluginImp({
      exclude: ["antd"],
      libList: [
        {
          libName: "lodash",
          libDirectory: "",
          camel2DashComponentName: false,
        },
      ],
    }),
    visualizer(),
  ],
  build: {
    rollupOptions: {
      treeshake: {
        preset: "recommended",
        manualPureFunctions: ["console.log"],
      },
    },
  },
  define: {
    __APP__: JSON.stringify("PM"),
  },
  envPrefix: ["VERSION"],
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
});
