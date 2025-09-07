# Example Module

This package demonstrates how API modules are structured. A module is an npm package that exports a Fastify plugin. The core API automatically loads all packages found under `packages/`.

```ts
import { FastifyInstance } from "fastify";
export default async function exampleModule(app: FastifyInstance) {
  app.get("/example", async () => ({ message: "example module response" }));
}
```

Drop this folder under `packages/` and it will be loaded automatically.
