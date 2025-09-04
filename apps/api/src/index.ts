import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.js";
import { ensureBaseRoles } from "./lib/roles.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: (origin, cb) => {
    const allowed = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",").map(s => s.trim()).filter(Boolean);
    if (!origin || allowed.includes(origin)) cb(null, true);
    else cb(new Error("CORS"), false);
  }
});

await app.register(jwt, { secret: process.env.JWT_SECRET! });

await app.register(authRoutes);

app.get("/healthz", () => ({ ok: true }));

const host = process.env.API_HOST || "0.0.0.0";
const port = +(process.env.API_PORT || 4000);

app.listen({ host, port })
  .then(async () => { await ensureBaseRoles(); app.log.info(`API on http://${host}:${port}`); })
  .catch(err => { app.log.error(err); process.exit(1); });