"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { apiFetch, type DemoIncident } from "@/lib/demo";

type IncidentRecord = DemoIncident & {
  description: string;
  createdAt: string;
  updates: Array<{ id: string; authorName: string; content: string; timestamp: string; status?: string | null }>;
  assignments: Array<{ id: string; responderId?: string | null; resourceType?: string | null; status: string }>;
};

export default function IncidentDetailPage() {
  const params = useParams<{ id: string }>();
  const [incident, setIncident] = useState<IncidentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch<{ incident: IncidentRecord }>(`/incidents/${encodeURIComponent(params.id)}`)
      .then((payload) => setIncident(payload.incident))
      .catch(() => setError("This incident could not be loaded. It may not exist or may not be available to your account."))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <WorkspaceShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/incidents" className="text-sm font-semibold text-sky-700 hover:underline">← Back to incidents</Link>
        {loading ? <p className="mt-6 text-slate-500">Loading incident…</p> : null}
        {error ? <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
        {incident ? (
          <>
            <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">{incident.incidentNumber} · {incident.type.replaceAll("_", " ")}</p>
              <h1 className="mt-2 text-3xl font-bold">{incident.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-red-50 px-3 py-1 text-red-800">{incident.severity}</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-800">{incident.status.replaceAll("_", " ")}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{incident.locationName || "Location not provided"}</span>
              </div>
              <p className="mt-5 max-w-3xl leading-7 text-slate-700">{incident.description}</p>
            </header>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Incident history</h2>
                {incident.updates.length ? (
                  <ol className="mt-5 space-y-5">
                    {incident.updates
                      .slice()
                      .sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime())
                      .map((update) => (
                        <li key={update.id} className="flex gap-4">
                          <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-sky-600 ring-4 ring-sky-100" />
                          <div className="min-w-0 flex-1 border-b border-slate-100 pb-4">
                            <p className="font-medium text-slate-900">{update.content}</p>
                            <p className="mt-1 text-xs text-slate-500">{update.authorName} · {new Date(update.timestamp).toLocaleString()}</p>
                          </div>
                        </li>
                      ))}
                  </ol>
                ) : <p className="mt-4 text-sm text-slate-500">No updates have been recorded yet.</p>}
              </section>
              <aside className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold">Response assignments</h2>
                  {incident.assignments.length ? (
                    <ul className="mt-4 space-y-3">
                      {incident.assignments.map((assignment) => (
                        <li key={assignment.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                          <p className="font-medium">{assignment.resourceType || "Response team"}</p>
                          <p className="mt-1 text-slate-600">Status: {assignment.status.replaceAll("_", " ")}</p>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="mt-2 text-sm text-slate-500">No response assignments recorded.</p>}
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold">Record details</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div><dt className="text-slate-500">Reported</dt><dd className="mt-1 font-medium">{new Date(incident.createdAt).toLocaleString()}</dd></div>
                    <div><dt className="text-slate-500">Priority score</dt><dd className="mt-1 font-medium">{incident.priorityScore ?? "Not assessed"}</dd></div>
                  </dl>
                </section>
              </aside>
            </div>
          </>
        ) : null}
      </main>
    </WorkspaceShell>
  );
}
