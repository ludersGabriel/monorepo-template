import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import svgr from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from '@tailwindcss/vite'

import Icons from "./public/icons.json"

const ReactCompilerConfig = {
  sources: (filename: string) => {
    // Normalize path separators for consistency
    const normalizedFilename = filename.replace(/\\/g, "/")
    const excludePaths = [
      "/src/components/user/",
      "/src/components/table/",
    ]
    return !excludePaths.some(excludePath => normalizedFilename.includes(excludePath))
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../api/public",
    emptyOutDir: true,
    rollupOptions: {
      external: ["@corax-monorepo/api"],
    },
  },
  plugins: [
    TanStackRouterVite({
      routeTreeFileHeader: [
        "/* eslint-disable eslint-comments/no-unlimited-disable */",
        "/* eslint-disable */",
      ],
      generatedRouteTree: "./src/route-tree.gen.ts",
    }),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "inline",
      manifest: {
        name: "Corax vite template",
        short_name: "CoraxT",
        description: "This is the PWA for the corax template app",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: Icons.icons,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },

    }),
    svgr(),
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
