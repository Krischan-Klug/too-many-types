import { FastifyInstance } from "fastify";

const enabled = (process.env.MODULES || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * Registers Fastify plugins listed in the MODULES env variable.
 * Each module must export a default function accepting a FastifyInstance.
 */
export async function registerModules(app: FastifyInstance) {
  for (const name of enabled) {
    try {
      const mod = await import(name);
      const plugin = mod.default;
      if (typeof plugin === "function") {
        await app.register(plugin);
        app.log.info(`module '${name}' loaded`);
      } else {
        app.log.error(`module '${name}' has no default export`);
      }
    } catch (err) {
      app.log.error({ err }, `failed to load module '${name}'`);
    }
  }
}
