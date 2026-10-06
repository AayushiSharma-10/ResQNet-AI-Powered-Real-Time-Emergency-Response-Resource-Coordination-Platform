"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { apiFetch, type DemoIncident } from "@/lib/demo";

const allowedRoles = ["DISPATCHER", "ADMINISTRATOR", "EMERGENCY_AUTHORITY"];

type Totals = { totalIncidents: number; criticalIncidents: number; activeAlerts: number; resources: number };

export default function AnalyticsPage() {
  const [role, setRole] = useState("");
  const [incidents, setIncidents] = useState<DemoIncident[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("resqnet-user");
    let currentRole = "";
    if (storedUser) {
      try {
        currentRole = (JSON.parse(storedUser) as { role?: string }).role ?? "";
        setRole(currentRole);
      } catch {
        setError("Your session details could not be read. Please sign in again.");
      }
    }
    if (!allowedRoles.includes(currentRole)) {
      setLoading(false);
      return;
    }

    void Promise.all([
      apiFetch<{ incidents: DemoIncident[] }>("/incidents?limit=100"),
      apiFetch<{ totals: Totals }>("/analytics/summary"),
    ])
      .then(([incidentPayload, summaryPayload]) => {
        setIncidents(incidentPayload.incidents);
        setTotals(summaryPayload.totals);
      })
      .catch(() => setError("Analytics could not be loaded. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const breakdown = useMemo(() => {
    const count = (value: string) => incidents.filter((incident) => incident.severity === value).length;
    return [
      { label: "Critical", value: count("CRITICAL"), style: "bg-red-600" },
      { label: "High", value: count("HIGH"), style: "bg-amber-500" },
      { label: "Medium", value: count("MEDIUM"), style: "bg-sky-600" },
      { label: "Low", value: count("LOW"), style: "bg-emerald-600" },
    ];
  }, [incidents]);
  const largestSeverityCount = Math.max(1, ...breakdown.map(({ value }) => value));

  return (
    <WorkspaceShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">Operations intelligence</p>
          <h1 className="mt-2 text-3xl font-bold">Analytics</h1>
          <p className="mt-2 text-slate-600">Current counts calculated from ResQNet incident, alert, and resource records.</p>
        </div>

        {!loading && !allowedRoles.includes(role) ? (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-semibold text-amber-900">This view is for operations leadership</h2>
            <p className="mt-2 text-sm text-amber-800">Your workspace does not include system-wide analytics.</p>
            <Link href="/dashboard" className="mt-4 inline-block font-semibold text-sky-800 hover:underline">Return to your dashboard</Link>
          </section>
        ) : (
          <>
            {error ? <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
            <section aria-label="Current totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total incidents", value: totals?.totalIncidents },
                { label: "Critical incidents", value: totals?.criticalIncidents },
                { label: "Active alerts", value: totals?.activeAlerts },
                { label: "Tracked resources", value: totals?.resources },
              ].map((item) => (
                <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold">{loading ? "—" : item.value ?? 0}</p>
                  <p className="mt-2 text-xs text-slate-500">Live database total</p>
                </article>
              ))}
            </section>

            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Incident severity distribution</h2>
              <p className="mt-1 text-sm text-slate-500">Based on incident records available to your role.</p>
              {loading ? <p className="mt-6 text-sm text-slate-500">Loading analytics…</p> : (
                <div className="mt-6 space-y-5">
                  {breakdown.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex justify-between text-sm"><span>{item.label}</span><span className="font-medium">{item.value}</span></div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${item.style}`} style={{ width: `${Math.max(item.value ? 4 : 0, item.value / largestSeverityCount * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-5 text-xs text-slate-500">This view reports recorded counts and does not estimate response performance.</p>
            </section>
          </>
        )}
      </main>
    </WorkspaceShell>
  );
}
