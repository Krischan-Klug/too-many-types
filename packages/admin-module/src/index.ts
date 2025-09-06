import { FastifyInstance } from "fastify";

export { default as AdminPanel } from "./AdminPanel.js";

interface RegisterBody {
  email: string;
  password: string;
}

interface GrantBody {
  userId: string;
}

// Simple in-memory store for demonstration only
const users: { [id: string]: { email: string; isAdmin: boolean } } = {};

export default async function adminModule(app: FastifyInstance) {
  app.post<{ Body: RegisterBody }>("/admin/register", async (req, reply) => {
    const id = Date.now().toString();
    users[id] = { email: req.body.email, isAdmin: false };
    return { id };
  });

  app.post<{ Body: GrantBody }>("/admin/grant", async (req, reply) => {
    const user = users[req.body.userId];
    if (!user) {
      reply.code(404);
      return { error: "user not found" };
    }
    user.isAdmin = true;
    return { ok: true };
  });
}
