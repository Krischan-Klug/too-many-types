import React from "react";

const req = (require as any).context("../../../packages", true, /AdminPanel\\.tsx$/);
const panels: React.ComponentType[] = req.keys().map((key: string) => req(key).default);

export default function Admin() {
  return (
    <React.StrictMode>
      {panels.map((Panel, i) => (
        <Panel key={i} />
      ))}
    </React.StrictMode>
  );
}
