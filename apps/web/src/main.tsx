import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root")!;

if (window.location.pathname.startsWith("/admin")) {
  const modules = import.meta.glob(
    "../../packages/*/src/AdminPanel.tsx",
    { eager: true, import: "default" }
  ) as Record<string, React.ComponentType>;
  const panels = Object.values(modules);
  createRoot(root).render(
    <React.StrictMode>
      {panels.map((Panel, i) => (
        <Panel key={i} />
      ))}
    </React.StrictMode>
  );
} else {
  createRoot(root).render(<App />);
}
