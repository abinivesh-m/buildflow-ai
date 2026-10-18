import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Runs api/generate.js inside the dev server so `npm run dev` works end to end.
function billflowApi(env) {
  return {
    name: "billflow-api",
    configureServer(server) {
      server.middlewares.use("/api/generate", async (req, res) => {
        process.env.GEMINI_API_KEY = env.GEMINI_API_KEY || "";
        if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL;
        try {
          const mod = await server.ssrLoadModule("/api/generate.js");
          await mod.default(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Dev server error: " + err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return { plugins: [react(), billflowApi(env)] };
});
