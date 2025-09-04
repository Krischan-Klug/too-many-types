import { prisma } from "./prisma.js";

export async function ensureBaseRoles() {
  await prisma.role.upsert({ where: { name: "admin" }, update: {}, create: { name: "admin" } });
  await prisma.role.upsert({ where: { name: "user" },  update: {}, create: { name: "user" } });
}