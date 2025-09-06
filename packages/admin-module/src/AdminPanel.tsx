import { useState } from "react";

const API = "http://localhost:4000";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");

  const register = async () => {
    await fetch(`${API}/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  };

  const grant = async () => {
    await fetch(`${API}/admin/grant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h2>Admin Panel</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <input placeholder="User ID" value={userId} onChange={e=>setUserId(e.target.value)} />
      <button onClick={grant}>Grant Admin</button>
    </div>
  );
}
