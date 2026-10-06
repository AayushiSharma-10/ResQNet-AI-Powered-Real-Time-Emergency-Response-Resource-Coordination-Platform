"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { apiFetch, type DemoIncident } from "@/lib/demo";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

type IncidentList = { incidents: DemoIncident[]; total: number };
type AnalyticsSummary = {
  totals: {
    totalIncidents: number;
    criticalIncidents: number;
    activeAlerts: number;
    resources: number;
  };
};

const roleCopy: Record<string, { heading: string; description: string; action?: { label: string; href: string } }> = {
  CITIZEN: {
    heading: "Your incident reports",
    description: "Submit an emergency report and follow the status of reports associated with your account.",
    action: { label: "Report an emergency", href: "/incidents/new" },
  },
  RESPONDER: {
    heading: "Your response assignments",
    description: "Review incidents assigned to you and follow their status and response timeline.",
  },
  DISPATCHER: {
    heading: "Live operations",
    description: "Review incoming incidents and coordinate dispatch across response teams.",
    action: { label: "Review incidents", href: "/incidents" },
  },
  HOSPITAL: {
    heading: "Care coordination",
    description: "Review incident activity and coordinate response information with dispatch.",
    action: { label: "View incidents", href: "/incidents" },
  },
  ADMINISTRATOR: {
    heading: "Operations overview",
    description: "Monitor current incidents, active resources, and system-wide response activity.",
    action: { label: "View analytics", href: "/analytics" },
  },
  EMERGENCY_AUTHORITY: {
    heading: "Situation overview",
    description: "Review incidents across the network and monitor the current operational picture.",
    action: { label: "View analytics", href: "/analytics" },
  },
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<DemoIncident[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary["totals"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let role = "";
    const storedUser = window.localStorage.getItem("resqnet-user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        role = parsedUser.role;
        setUser(parsedUser);
      } catch {
        setError("Your saved session could not be read. Sign out and sign in again.");
      }
    }

    void (async () => {
      try {
        const incidentPayload = await apiFetch<IncidentList>("/incidents");
        setIncidents(incidentPayload.incidents);
        if (["DISPATCHER", "ADMINISTRATOR", "EMERGENCY_AUTHORITY"].includes(role)) {
          const summaryPayload = await apiFetch<AnalyticsSummary>("/analytics/summary");
          setSummary(summaryPayload.totals);
        }
      } catch {
        setError("We couldn't load your workspace data. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const role = user?.role ?? "CITIZEN";
  const content = roleCopy[role] ?? roleCopy.CITIZEN;
  const openIncidents = useMemo(
    () => incidents.filter((incident) => !["RESOLVED", "CLOSED"].includes(incident.status)).length,
    [incidents],
  );

  return (
    <WorkspaceShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">{role.replaceAll("_", " ")}</p>
            <h1 className="mt-2 text-3xl font-bold">{content.heading}</h1>
            <p className="mt-2 max-w-2xl text-slate-600">{content.description}</p>
          </div>
          {content.action ? (
            <Link href={content.action.href} className="inline-flex justify-center rounded-lg bg-sky-700 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-800">
              {content.action.label}
            </Link>
          ) : null}
        </div>

        {error ? (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        ) : null}

        <section aria-label="Workspace summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(["CITIZEN", "RESPONDER", "HOSPITAL"].includes(role)
            ? [
                { label: role === "CITIZEN" ? "My reports" : role === "RESPONDER" ? "Assigned incidents" : "Incoming incidents", value: loading ? "—" : String(incidents.length) },
                { label: "Open", value: loading ? "—" : String(openIncidents) },
                { label: "Critical", value: loading ? "—" : String(incidents.filter((item) => item.severity === "CRITICAL").length) },
              ]
            : [
                { label: "All incidents", value: loading ? "—" : String(summary?.totalIncidents ?? 0) },
                { label: "Critical incidents", value: loading ? "—" : String(summary?.criticalIncidents ?? 0) },
                { label: "Active alerts", value: loading ? "—" : String(summary?.activeAlerts ?? 0) },
                { label: "Tracked resources", value: loading ? "—" : String(summary?.resources ?? 0) },
              ]
          ).map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
              <p className="mt-2 text-xs text-slate-500">From current ResQNet records</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{role === "CITIZEN" ? "Reports linked to your account" : role === "RESPONDER" ? "Assigned incidents" : "Recent incidents"}</h2>
              <p className="mt-1 text-sm text-slate-500">Select an incident to view its details and timeline.</p>
            </div>
            <Link href="/incidents" className="text-sm font-semibold text-sky-700 hover:underline">View incident list</Link>
          </div>
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading records…</p>
          ) : incidents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center">
              <p className="font-medium text-slate-800">No incidents to show yet</p>
              <p className="mt-1 text-sm text-slate-500">{role === "CITIZEN" ? "Reports you submit will appear here." : "New assignments and incident records will appear here."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-3 pr-4">Incident</th>
                    <th className="py-3 pr-4">Type</th>
                    <th className="py-3 pr-4">Severity</th>
                    <th className="py-3 pr-4">Location</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.slice(0, 8).map((incident) => (
                    <tr key={incident.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4"><Link href={`/incidents/${incident.id}`} className="font-semibold text-sky-700 hover:underline">{incident.incidentNumber}</Link></td>
                      <td className="py-3 pr-4">{incident.type.replaceAll("_", " ")}</td>
                      <td className="py-3 pr-4">{incident.severity}</td>
                      <td className="py-3 pr-4">{incident.locationName || "Location not provided"}</td>
                      <td className="py-3 pr-4">{incident.status.replaceAll("_", " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </WorkspaceShell>
  );
}
