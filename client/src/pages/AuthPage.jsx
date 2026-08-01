import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import Field from "../components/common/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useBodyBackground } from "../hooks/useBodyBackground.js";

export default function AuthPage() {
  useBodyBackground("#F3F5F1");
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email || !pw || (mode === "signup" && !name)) { setErr("Please fill in all fields."); return; }
    if (pw.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setErr("");
    setSubmitting(true);
    try {
      if (mode === "signup") await signup(name, email, pw);
      else await login(email, pw);
    } catch (e) {
      setErr(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sv-root min-h-screen flex items-center justify-center px-4" data-theme="light">
      <div className="sv-card sv-anim p-8 w-full" style={{ maxWidth: 400 }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span className="sv-display text-xl font-semibold">StudyVault</span>
        </div>
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: "var(--surface2)" }}>
          {["login", "signup"].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-2 text-sm font-medium rounded-lg capitalize"
              style={{ background: mode === m ? "var(--surface)" : "transparent", boxShadow: mode === m ? "var(--shadow)" : "none" }}>
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>
        {mode === "signup" && (
          <Field label="Full name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="sv-input w-full px-3 py-2 text-sm" placeholder="Aarav Sharma" />
          </Field>
        )}
        <Field label="College email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="sv-input w-full px-3 py-2 text-sm" placeholder="you@campus.edu" />
        </Field>
        <Field label="Password">
          <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" className="sv-input w-full px-3 py-2 text-sm" placeholder="••••••••" />
        </Field>
        {err && <p className="text-xs mb-3" style={{ color: "var(--danger)" }}>{err}</p>}
        <button onClick={submit} disabled={submitting} className="sv-btn-primary w-full py-2.5 text-sm mt-1" style={{ opacity: submitting ? 0.7 : 1 }}>
          {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
        <p className="text-xs text-center mt-4" style={{ color: "var(--muted)" }}>
          {mode === "login" ? "New to StudyVault? " : "Already have an account? "}
          <button className="font-semibold underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
