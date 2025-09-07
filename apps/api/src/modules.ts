import { FastifyInstance } from "fastify";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Automatically registers Fastify plugins from packages/*.
 * Each package must export a default plugin.
 */
export async function registerModules(app: FastifyInstance) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const packagesDir = path.resolve(__dirname, "../../../packages");
  let dirs: fs.Dirent[] = [];
  try {
    dirs = fs.readdirSync(packagesDir, { withFileTypes: true });
  } catch (err) {
    app.log.error({ err }, "failed to read packages directory");
    return;
  }

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const pkgPath = path.join(packagesDir, dir.name, "package.json");
    if (!fs.existsSync(pkgPath)) continue;

    let main = "index.js";
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      main = pkg.main || main;
    } catch {
      continue;
    }

    const modPath = path.join(packagesDir, dir.name, main);
    try {
      const mod = await import(modPath);
      const plugin = mod.default;
      if (typeof plugin === "function") {
        await app.register(plugin);
        app.log.info(`module '${dir.name}' loaded`);
      } else {
        app.log.error(`module '${dir.name}' has no default export`);
      }
    } catch (err) {
      app.log.error({ err }, `failed to load module '${dir.name}'`);
    }
  }
}
