import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), visualizer()],
  build: {
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 400000,
        // manualChunks,
      },
      treeshake: {
        preset: "recommended",
        manualPureFunctions: ["console.log"],
      },
    },
  },
  define:{
    __APP__:JSON.stringify('PM')
  },
  envPrefix: ["VERSION"],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
});
