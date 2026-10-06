"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const demoAccounts = [
  { email: "admin@resqnet.local", password: "Admin123!" },
  { email: "dispatcher@resqnet.local", password: "Dispatch123!" },
  { email: "responder@resqnet.local", password: "Responder123!" },
  { email: "hospital@resqnet.local", password: "Hospital123!" },
  { email: "citizen@resqnet.local", password: "Citizen123!" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const payload = await response.json();
        window.localStorage.setItem("resqnet-user", JSON.stringify(payload.user));
        window.localStorage.setItem("resqnet-token", payload.token);
        const next = new URLSearchParams(window.location.search).get("next");
        router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
        return;
      }

      setError(response.status === 401
        ? "Email or password is incorrect. Check the demo account details below and try again."
        : "Sign-in is temporarily unavailable. Please try again.");
    } catch {
      setError("The sign-in service is unavailable. Please check that the API is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900 shadow-2xl shadow-sky-500/10 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-sky-600 via-blue-700 to-slate-900 p-8 md:p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 font-bold">R</div>
            <div>
              <p className="text-2xl font-bold">ResQNet</p>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Emergency command</p>
            </div>
          </div>
          <h1 className="mt-12 text-4xl font-bold leading-tight">Coordinate the response before the next incident escalates.</h1>
          <p className="mt-4 max-w-md text-sky-100/90">Sign in to monitor incidents, assign resources, track hospitals, and manage AI-assisted dispatch across every region.</p>
          <div className="mt-12 space-y-4 text-sm text-sky-100/90">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">AI triage and duplicate detection are live.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Dispatch and alerts are synchronized across the operational network.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">The platform supports citizens, responders, dispatchers, and hospitals.</div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Access portal</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Sign in</h2>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 focus:border-sky-500" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 focus:border-sky-500" placeholder="••••••••" />
            </div>

            {error ? <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg shadow-red-500/20 disabled:opacity-60">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
            <p className="mb-2 font-medium text-white">Demo accounts</p>
            <p className="mb-3 text-xs text-slate-400">Use one of these accounts to access the matching workspace.</p>
            <ul className="space-y-1">
              {demoAccounts.map((account) => (
                <li key={account.email}><span className="text-sky-300">{account.email}</span> / {account.password}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            Need access? <Link href="/" className="text-sky-400 underline">Return home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
