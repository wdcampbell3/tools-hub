import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vitest/config"
import { buildAndCacheSearchIndex } from "./src/lib/build_index"

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: "vite-build-search-index",
      writeBundle: {
        order: "post",
        sequential: false,
        handler: async () => {
          console.log("Building search index...")
          await buildAndCacheSearchIndex()
        },
      },
    },
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    globals: true, /// allows to skip import of test functions like `describe`, `it`, `expect`, etc.
  },
  define: {
    // Provide default empty values for optional environment variables
    "import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID": JSON.stringify(
      process.env.PUBLIC_GOOGLE_ANALYTICS_ID || "",
    ),
  },
})
