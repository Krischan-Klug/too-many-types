# Example Module

This package demonstrates how API modules are structured. A module is an npm package that exports a Fastify plugin. The core API loads modules listed in the `MODULES` environment variable.

```ts
import { FastifyInstance } from "fastify";
export default async function exampleModule(app: FastifyInstance) {
  app.get("/example", async () => ({ message: "example module response" }));
}
```

Enable it by adding `example-module` to `MODULES`.
