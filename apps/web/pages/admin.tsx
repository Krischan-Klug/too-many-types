import { ComponentType } from "react";

const req = (require as any).context("../../../packages", true, /AdminPanel\\.tsx$/);
const panels: ComponentType[] = req.keys().map((key: string) => req(key).default);

export default function Admin() {
  return (
    <>
      {panels.map((Panel, i) => (
        <Panel key={i} />
      ))}
    </>
  );
}
