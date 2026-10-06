"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { apiFetch, type DemoIncident } from "@/lib/demo";

type IncidentList = { incidents: DemoIncident[]; total: number };

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<DemoIncident[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const suffix = query ? `?search=${encodeURIComponent(query)}` : "";
    apiFetch<IncidentList>(`/incidents${suffix}`)
      .then((payload) => setIncidents(payload.incidents))
      .catch(() => setError("Incident records could not be loaded. Try again or check your connection."))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <WorkspaceShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">Incident management</p>
            <h1 className="mt-2 text-3xl font-bold">Incidents</h1>
            <p className="mt-2 text-slate-600">Review records available to your role and open an incident for its current status and timeline.</p>
          </div>
          <Link href="/incidents/new" className="rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-red-700">Report incident</Link>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); setQuery(search.trim()); }} className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
          <label htmlFor="incident-search" className="sr-only">Search incidents</label>
          <input id="incident-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search incident, description, or location" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100" />
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700">Search</button>
          {query ? <button type="button" onClick={() => { setSearch(""); setQuery(""); }} className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50">Clear</button> : null}
        </form>

        {error ? <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-slate-500">Loading incidents…</p>
          ) : incidents.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="font-semibold">No matching incidents</h2>
              <p className="mt-1 text-sm text-slate-500">Try a different search or check back when new records are available.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Incident</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Severity</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3"><span className="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="border-t border-slate-100">
                      <td className="px-4 py-4 font-semibold text-slate-900">{incident.incidentNumber}</td>
                      <td className="px-4 py-4">{incident.type.replaceAll("_", " ")}</td>
                      <td className="px-4 py-4">{incident.severity}</td>
                      <td className="px-4 py-4">{incident.locationName || "Not provided"}</td>
                      <td className="px-4 py-4">{incident.status.replaceAll("_", " ")}</td>
                      <td className="px-4 py-4"><Link href={`/incidents/${incident.id}`} className="font-semibold text-sky-700 hover:underline">Details</Link></td>
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
