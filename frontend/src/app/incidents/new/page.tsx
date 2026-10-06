"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/WorkspaceShell";

const incidentTypes = ["MEDICAL", "FIRE", "ROAD_ACCIDENT", "CRIME", "NATURAL_DISASTER", "FLOOD", "EARTHQUAKE", "MISSING_PERSON", "INFRASTRUCTURE_FAILURE", "OTHER"];

export default function NewIncidentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    type: "FIRE",
    locationName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = window.localStorage.getItem("resqnet-token");
      if (!token) {
        router.replace("/login?next=%2Fincidents%2Fnew");
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          locationName: form.locationName,
          description: form.description,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "The incident report could not be submitted.");
      }

      const payload = await response.json();
      router.push(`/incidents/${payload.incident?.id ?? "demo"}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "The incident report could not be submitted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkspaceShell>
    <main className="px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-700">Emergency intake</p>
            <h1 className="mt-2 text-3xl font-bold">Create incident report</h1>
            <p className="mt-2 text-sm text-slate-600">Describe what happened and where. ResQNet will assess the report after submission.</p>
          </div>
          <button onClick={() => router.back()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400">Back</button>
        </div>

        <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Incident title</label>
            <input required minLength={3} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500" placeholder="Briefly describe the emergency" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Incident type</label>
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500">
              {incidentTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
            <input required value={form.locationName} onChange={(event) => setForm({ ...form, locationName: event.target.value })} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500" placeholder="Street address, landmark, or area" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea required minLength={10} value={form.description} rows={5} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500" placeholder="What happened? Include relevant safety details." />
          </div>

          {error ? <p className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p> : null}

          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60">
              {loading ? "Submitting…" : "Submit incident"}
            </button>
          </div>
        </form>
      </div>
    </main>
    </WorkspaceShell>
  );
}
