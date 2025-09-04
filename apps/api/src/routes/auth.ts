import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    const Body = z.object({
      email: z.string().email(),
      displayName: z.string().min(1),
      password: z.string().min(6)
    });
    const body = Body.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return reply.code(409).send({ error: "email_taken" });

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { email: body.email, displayName: body.displayName, passwordHash }
    });

    const role = await prisma.role.findUnique({ where: { name: "user" } });
    if (role) await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });

    const token = app.jwt.sign({ sub: user.id, roles: ["user"] }, { expiresIn: "8h" });
    return reply.code(201).send({
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName, roles: ["user"] }
    });
  });

  app.post("/auth/login", async (req, reply) => {
    const Body = z.object({ email: z.string().email(), password: z.string().min(6) });
    const { email, password } = Body.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } }
    });
    if (!user) return reply.code(401).send({ error: "invalid_credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: "invalid_credentials" });

    const roles = user.roles.map(r => r.role.name);
    const token = app.jwt.sign({ sub: user.id, roles }, { expiresIn: "8h" });

    return { token, user: { id: user.id, email: user.email, displayName: user.displayName, roles } };
  });

  app.get("/me", { preHandler: [authGuard] }, async (req: any) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      include: { roles: { include: { role: true } } }
    });
    return {
      id: user?.id,
      email: user?.email,
      displayName: user?.displayName,
      roles: user?.roles.map(r => r.role.name) ?? []
    };
  });

  app.get("/admin/only", { preHandler: [authGuard, roleGuard("admin")] }, async () => {
    return { secret: "for admins" };
  });
}

async function authGuard(req: any, reply: any) {
  try { await req.jwtVerify(); }
  catch { return reply.code(401).send({ error: "unauthorized" }); }
}

function roleGuard(required: string) {
  return async (req: any, reply: any) => {
    const roles: string[] = req.user?.roles || [];
    if (!roles.includes(required)) return reply.code(403).send({ error: "forbidden" });
  };
}