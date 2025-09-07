// apps/api/src/index.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.js";
import { ensureBaseRoles } from "./lib/roles.js";
import { registerModules } from "./modules.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  credentials: true,
});

await app.register(jwt, { secret: process.env.JWT_SECRET! });

await app.register(authRoutes);
await registerModules(app);

app.get("/healthz", () => ({ ok: true }));

const host = process.env.API_HOST || "0.0.0.0";
const port = +(process.env.API_PORT || 4000);

app
  .listen({ host, port })
  .then(async () => {
    await ensureBaseRoles();
    app.log.info(`API on http://${host}:${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
