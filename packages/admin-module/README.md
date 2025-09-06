# Admin Module

Provides basic administrative features such as user registration and role assignment.
Exports a Fastify plugin and a React component for the admin panel.

## Server Usage
```ts
import { FastifyInstance } from "fastify";
import adminModule from "admin-module";

export default async function(app: FastifyInstance) {
  await app.register(adminModule);
}
```

## Frontend Usage
```tsx
import { AdminPanel } from "admin-module";

export default function Page() {
  return <AdminPanel />;
}
```
