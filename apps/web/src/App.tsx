import { useEffect, useState } from "react";

const API = "http://localhost:4000";

export default function App() {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const t = localStorage.getItem("auth");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(setMe).catch(()=>{});
  }, [token]);

  const submit = async (e: any) => {
    e.preventDefault();
    const url = mode === "login" ? "/auth/login" : "/auth/register";
    const body = mode === "login"
      ? { email, password }
      : { email, password, displayName: displayName || email.split("@")[0] };

    const r = await fetch(`${API}${url}`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    const d = await r.json();
    if (d.token) {
      localStorage.setItem("auth", d.token);
      setToken(d.token);
    } else {
      alert(JSON.stringify(d));
    }
  };

  const logout = () => { localStorage.removeItem("auth"); setToken(null); setMe(null); };

  if (!token) {
    return (
      <div style={{ maxWidth: 360, margin: "48px auto", display: "grid", gap: 8 }}>
        <h1>{mode === "login" ? "Login" : "Register"}</h1>
        {mode === "register" && (
          <input placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
        )}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={submit}>{mode === "login" ? "Sign in" : "Create account"}</button>
        <button onClick={()=>setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "No account? Register" : "Have an account? Login"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "48px auto" }}>
      <h1>Welcome {me?.displayName || me?.email}</h1>
      <p>Roles: {me?.roles?.join(", ") || "—"}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}