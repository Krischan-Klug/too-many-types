import { FastifyInstance } from "fastify";

// Example Fastify plugin demonstrating module structure
export default async function exampleModule(app: FastifyInstance) {
  app.get("/example", async () => ({ message: "example module response" }));
}
