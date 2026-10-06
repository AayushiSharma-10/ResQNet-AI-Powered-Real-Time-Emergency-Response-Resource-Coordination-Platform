import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Report and triage",
    description:
      "Capture an emergency report with its location and details. AI-assisted triage supports responders; people remain responsible for critical decisions.",
  },
  {
    number: "02",
    title: "Coordinate response",
    description:
      "Dispatch teams, track incident status, and keep the relevant response roles working from one shared operational record.",
  },
  {
    number: "03",
    title: "Keep people informed",
    description:
      "Follow incident updates and coordinate hospital and resource information through role-appropriate workspaces.",
  },
];

const roles = [
  ["Citizen", "Submit a report and follow incidents you reported."],
  ["Responder", "Review response work and follow assigned incident updates."],
  ["Dispatcher", "Review incidents, coordinate dispatch, and monitor operations."],
  ["Hospital", "Review incident coordination information relevant to care teams."],
  ["Administrator", "Review the operational picture and service analytics."],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="ResQNet home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 text-lg font-bold text-white">R</span>
            <span>
              <span className="block text-lg font-bold leading-5">ResQNet</span>
              <span className="block text-xs text-slate-500">Emergency coordination</span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-sky-700">How it works</a>
            <a href="#roles" className="hover:text-sky-700">Who it serves</a>
            <Link href="/login" className="hover:text-sky-700">Sign in</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Sign in
            </Link>
            <Link href="/login?next=%2Fincidents%2Fnew" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Report emergency
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              Emergency response coordination
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Clear information. Coordinated response.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              ResQNet connects citizens, dispatchers, responders, hospitals, and administrators around an incident record and its response.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login?next=%2Fincidents%2Fnew" className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700">
                Report an emergency
              </Link>
              <Link href="/login" className="rounded-lg border border-slate-600 px-5 py-3 font-semibold text-white hover:border-sky-300 hover:text-sky-200">
                Sign in to your workspace
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              If someone is in immediate danger, contact your local emergency services directly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">A shared response workflow</p>
            <ol className="mt-6 space-y-5">
              {capabilities.map((step) => (
                <li key={step.number} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-sm font-bold text-sky-200">{step.number}</span>
                  <div>
                    <h2 className="font-semibold text-white">{step.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">Built for coordinated action</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">One platform, clear responsibilities</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Each person signs in to a workspace shaped around their role. Private operational information stays behind authentication, while public visitors can learn how ResQNet works and choose the right next step.
          </p>
        </div>
        <div id="roles" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map(([role, description]) => (
            <article key={role} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">{role}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>ResQNet · Emergency response coordination</p>
          <div className="flex gap-5">
            <Link href="/login" className="font-medium hover:text-sky-700">Sign in</Link>
            <Link href="/login?next=%2Fincidents%2Fnew" className="font-medium hover:text-sky-700">Report emergency</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
