const navItems = ["Home", "How It Works", "Emergency Services", "Live Situation", "Resources", "About", "Contact"];

const stats = [
  { label: "Active Incidents", value: "128", detail: "+14 in 60 min" },
  { label: "Responders Online", value: "482", detail: "89% available" },
  { label: "Resources Available", value: "1,240", detail: "Across 18 districts" },
  { label: "Average Response Time", value: "6.8 min", detail: "Demo data" },
];

const flowSteps = [
  { title: "Report", description: "Citizens submit incidents with location, urgency, and context in under 60 seconds." },
  { title: "Assess", description: "AI triage analyzes severity, risk, and resource needs with human review required for critical decisions." },
  { title: "Respond", description: "Dispatch teams, hospitals, and relief assets in real time with optimized routes and updates." },
];

const serviceCards = [
  { title: "AI Incident Triage", description: "Classify incoming reports, estimate risk, and explain recommendations before dispatch.", tone: "blue" },
  { title: "Smart Dispatch", description: "Assign volunteers, ambulances, police, and fire units based on distance, load, and urgency.", tone: "red" },
  { title: "Resource Coordination", description: "Track beds, shelters, supplies, and relief inventory across government and NGO networks.", tone: "green" },
  { title: "Live Command Center", description: "Monitor evolving incidents, road closures, and responder status from one unified operational view.", tone: "amber" },
];

const alerts = [
  { severity: "Critical", text: "Multi-vehicle collision reported near Rivergate Expressway." },
  { severity: "High", text: "Flood advisories issued for North Basin and industrial corridor." },
  { severity: "Medium", text: "Shelter capacity update: Green Valley Center has 18 beds free." },
];

const incidentRows = [
  { id: "RQ-10482", type: "Road Accident", severity: "Critical", eta: "4 min", team: "Ambulance A12 + Fire F04" },
  { id: "RQ-10476", type: "Medical", severity: "High", eta: "7 min", team: "Paramedic Unit P02" },
  { id: "RQ-10461", type: "Flood", severity: "Medium", eta: "12 min", team: "Relief Team R09" },
];

const aiModules = [
  { title: "Duplicate Detection", text: "87% match between two nearby reports describing the same highway collision." },
  { title: "Route Optimization", text: "Fastest route available: 7 min via East Ring Road with 3 min traffic delay avoided." },
  { title: "Risk Forecasting", text: "High probability of additional flooding in Zone B based on rainfall and water levels." },
  { title: "Situation Summary", text: "Critical road accident reported at 14:32. Ambulance A12 dispatched and hospital notified." },
];

const sectors = [
  { name: "North District", value: "94%", change: "+12%" },
  { name: "West Medical", value: "71%", change: "+5%" },
  { name: "Coastal Zone", value: "68%", change: "+18%" },
  { name: "Central Transit", value: "83%", change: "+9%" },
];

const roleCards = [
  { title: "Citizen", summary: "Report emergencies, track own incidents, and access neighborhood alerts." },
  { title: "Responder", summary: "Accept assignments, navigate routes, and update real-time incident status." },
  { title: "Dispatcher", summary: "Coordinate resources, assign teams, and manage emergency flow across regions." },
  { title: "Hospital", summary: "Monitor bed capacity, admit incoming patients, and request critical supplies." },
];

const healthMetrics = [
  { label: "Emergency Beds", value: "142" },
  { label: "ICU Availability", value: "24" },
  { label: "Ambulance Arrivals", value: "17" },
  { label: "Blood Inventory", value: "91%" },
];

function LogoMark() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-300/50 bg-gradient-to-br from-sky-400 to-blue-700 shadow-lg shadow-sky-500/30">
      <svg viewBox="0 0 48 48" className="h-6 w-6 text-white" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M24 6.5C15.4 6.5 8.5 13.4 8.5 22C8.5 31.1 18.1 40.7 23.5 42.5C28.9 40.7 38.5 31.1 38.5 22C38.5 13.4 31.6 6.5 24 6.5Z" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M24 12V36M12 24H36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="24" cy="22" r="3.5" fill="currentColor"/>
      </svg>
    </div>
  );
}


function getToneClasses(tone: string) {
  switch (tone) {
    case "blue": return "border-sky-200 bg-sky-50 text-sky-700";
    case "red": return "border-red-200 bg-red-50 text-red-700";
    case "green": return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "amber": return "border-amber-200 bg-amber-50 text-amber-700";
    default: return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-950/95 text-slate-50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="ResQNet home">
            <LogoMark />
            <div>
              <div className="text-lg font-semibold tracking-tight">ResQNet</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-sky-200/80">Emergency response</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={item === "Home" ? "#home" : `#${item.toLowerCase().replace(/\s+/g, "-")}`} className="transition hover:text-white">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-500 hover:text-sky-100 sm:inline-flex">Login</button>
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:from-red-400 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-red-300">
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
              Report Emergency
            </button>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.18),_transparent_35%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-sky-200">
                <span className="h-2 w-2 rounded-full bg-sky-300" />
                AI-powered emergency response
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                When Every Second Matters, <span className="text-sky-300">ResQNet</span> Connects the Right Help.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                An AI-powered emergency response and resource coordination platform that helps citizens, responders, hospitals, and authorities work together in real time.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-400 hover:to-red-500">Report an Emergency</button>
                <button className="rounded-full border border-slate-600 bg-slate-900/60 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-sky-400 hover:text-white">Access Response Center</button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2"><IconCheck className="h-4 w-4 text-emerald-400" /> Trusted by emergency services</div>
                <div className="flex items-center gap-2"><IconCheck className="h-4 w-4 text-emerald-400" /> Decision support with human verification</div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-slate-700/80 bg-slate-900/80 p-4 shadow-2xl shadow-sky-950/30">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 text-xs uppercase tracking-[0.18em] text-slate-300">
                  <span>Live situation</span>
                  <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Operational</span>
                </div>

                <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-700 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.18),_rgba(15,23,42,0.95)_50%,_rgba(2,6,23,1)_100%)] p-4">
                  <div className="relative h-[380px] overflow-hidden rounded-[1.25rem] border border-slate-700 bg-slate-900">
                    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

                    <div className="absolute left-8 top-10 h-14 w-14 rounded-full border border-sky-400/40 bg-sky-400/10" />
                    <div className="absolute right-16 top-20 h-16 w-16 rounded-full border border-red-400/40 bg-red-400/10" />
                    <div className="absolute bottom-12 left-16 h-20 w-20 rounded-full border border-amber-400/40 bg-amber-400/10" />
                    <div className="absolute bottom-14 right-12 h-20 w-28 rounded-full border border-emerald-400/40 bg-emerald-400/10" />

                    <div className="absolute left-20 top-20 flex items-center gap-2 rounded-full border border-red-400/50 bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-100">
                      <span className="h-2 w-2 rounded-full bg-red-400" />Critical
                    </div>
                    <div className="absolute left-1/2 top-28 flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/15 px-2.5 py-1.5 text-xs font-medium text-amber-100">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />High
                    </div>
                    <div className="absolute right-16 bottom-20 flex items-center gap-2 rounded-full border border-sky-400/50 bg-sky-500/15 px-2.5 py-1.5 text-xs font-medium text-sky-100">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />Medical
                    </div>

                    <div className="absolute left-12 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-4 border-slate-900 bg-red-500 shadow-lg shadow-red-500/50" />
                    <div className="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-4 border-slate-900 bg-amber-400 shadow-lg shadow-amber-400/50" />
                    <div className="absolute right-16 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-4 border-slate-900 bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                    <div className="absolute bottom-10 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-4 border-slate-900 bg-sky-400 shadow-lg shadow-sky-400/50" />

                    <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3 backdrop-blur">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        <span>Dispatch</span>
                        <span>7 incidents</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-slate-100">
                        <div className="flex items-center gap-2"><IconMap className="h-4 w-4 text-sky-300" /> 3 responders en route</div>
                        <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">On schedule</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-500">{stat.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">How it works</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">From alert to coordinated action</h2>
            </div>
            <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm md:block">Human verification required for high-risk AI recommendations</div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {flowSteps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">0{index + 1}</div>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="emergency-services" className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Emergency services</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">One operating picture for every responder and resource</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map((service) => (
                <div key={service.title} className="rounded-3xl border border-slate-700 bg-slate-950/60 p-6 shadow-sm shadow-slate-950/30">
                  <div className={`inline-flex rounded-2xl border p-3 ${getToneClasses(service.tone)}`}>
                    {service.title.includes("AI") ? <IconPulse className="h-5 w-5" /> : service.title.includes("Smart") ? <IconTruck className="h-5 w-5" /> : service.title.includes("Resource") ? <IconShield className="h-5 w-5" /> : <IconMap className="h-5 w-5" />}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="live-situation" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/80">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live map</div>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Regional emergency overview</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live network synced
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-100 p-3">
                <div className="relative h-[430px] overflow-hidden rounded-[1.2rem] border border-slate-200 bg-[radial-gradient(circle_at_center,_rgba(14,116,144,0.18),_rgba(240,249,255,0.96)_55%,_rgba(255,255,255,1)_100%)]">
                  <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                  <div className="absolute inset-x-0 top-1/3 h-px bg-slate-300/80" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300/80" />
                  <div className="absolute bottom-0 left-6 h-24 w-24 rounded-t-[50%] border border-slate-300 bg-sky-200/30" />
                  <div className="absolute right-8 top-12 h-28 w-28 rounded-full border border-slate-300 bg-emerald-200/30" />
                  <div className="absolute left-10 top-20 h-10 w-10 rounded-full border border-red-400 bg-red-200/50" />
                  <div className="absolute right-28 bottom-14 h-10 w-10 rounded-full border border-amber-400 bg-amber-200/50" />
                  <div className="absolute left-24 top-24 flex items-center gap-2 rounded-full border border-red-300 bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-700"><span className="h-2 w-2 rounded-full bg-red-500" />Critical</div>
                  <div className="absolute right-20 top-20 flex items-center gap-2 rounded-full border border-amber-300 bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-500" />High</div>
                  <div className="absolute left-1/2 bottom-14 flex items-center gap-2 rounded-full border border-sky-300 bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-700"><span className="h-2 w-2 rounded-full bg-sky-500" />Medical</div>
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Priority queue</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Live</span>
                </div>
                <div className="mt-5 space-y-4">
                  {incidentRows.map((incident) => (
                    <div key={incident.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{incident.id}</div>
                          <div className="text-xs text-slate-500">{incident.type}</div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${incident.severity === "Critical" ? "bg-red-100 text-red-700" : incident.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>{incident.severity}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                        <span>{incident.eta}</span>
                        <span>{incident.team}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm shadow-slate-900/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Operational status</h3>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">Stable</span>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  {alerts.map((alert) => (
                    <div key={alert.text} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${alert.severity === "Critical" ? "bg-red-400" : alert.severity === "High" ? "bg-amber-400" : "bg-sky-400"}`} />
                      <div>
                        <div className="font-semibold text-white">{alert.severity}</div>
                        <div className="mt-1 leading-6 text-slate-300">{alert.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">AI modules</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Explainable recommendations for fast, safe actions</h2>
              </div>
              <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm md:block">AI is decision support, not replacement for trained personnel</div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {aiModules.map((module) => (
                <div key={module.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
                  <div className="mb-4 inline-flex rounded-2xl border border-sky-200 bg-sky-50 p-2.5 text-sky-700"><IconPulse className="h-5 w-5" /> </div>
                  <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{module.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="resources" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm shadow-slate-900/20">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Emergency reporting</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Report in just a few steps</h2>

              <div className="mt-8 space-y-5">
                {[
                  "Select incident type and severity",
                  "Share location and situation details",
                  "Confirm contact details and submit",
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-300">{index + 1}</div>
                    <div>
                      <div className="text-base font-medium text-white">{step}</div>
                      <div className="mt-1 text-sm text-slate-300">AI triage immediately previews risk and recommended response teams.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">New report</div>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Emergency report workflow</h3>
                </div>
                <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Live</div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Emergency type</label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">Medical Emergency</div>
                  <label className="block text-sm font-medium text-slate-700">Location</label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">Central Highway, Sector 12</div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Severity</label>
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 font-medium text-red-700">Critical</div>
                  <label className="block text-sm font-medium text-slate-700">People affected</label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">4 reported</div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">AI Recommendation</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">Dispatch 2 ambulances and 1 fire-response unit.</div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-sky-700 shadow-sm">94/100</div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">Multiple injured persons and possible fire hazard reported. Nearest emergency hospital and trauma team notified.</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Confirm dispatch</button>
                <button className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300">Review manually</button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Roles</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Purpose-built experiences for each stakeholder</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {roleCards.map((role) => (
                <div key={role.title} className="rounded-3xl border border-slate-700 bg-slate-950/60 p-5">
                  <div className="inline-flex rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3 text-sky-300">
                    {role.title === "Citizen" ? <IconUsers className="h-5 w-5" /> : role.title === "Responder" ? <IconPulse className="h-5 w-5" /> : role.title === "Dispatcher" ? <IconMap className="h-5 w-5" /> : <IconHospital className="h-5 w-5" />}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{role.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{role.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/80">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Hospital dashboard</div>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Capacity and critical care</h3>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Capacity stable</div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {healthMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">{metric.label}</div>
                    <div className="mt-3 text-2xl font-bold text-slate-900">{metric.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600"><span>Emergency beds</span><span>72%</span></div>
                  <div className="h-2.5 rounded-full bg-slate-200"><div className="h-2.5 w-[72%] rounded-full bg-emerald-500" /></div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600"><span>ICU availability</span><span>41%</span></div>
                  <div className="h-2.5 rounded-full bg-slate-200"><div className="h-2.5 w-[41%] rounded-full bg-amber-500" /></div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600"><span>Blood inventory</span><span>91%</span></div>
                  <div className="h-2.5 rounded-full bg-slate-200"><div className="h-2.5 w-[91%] rounded-full bg-sky-500" /></div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/80">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Emergency hotspots</div>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">High-risk zones</h3>

              <div className="mt-6 space-y-4">
                {sectors.map((sector) => (
                  <div key={sector.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">{sector.name}</div>
                      <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{sector.change}</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                      <span>Risk index</span>
                      <span className="text-lg font-bold text-slate-900">{sector.value}</span>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-slate-200">
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-sky-400" style={{ width: sector.value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Why ResQNet</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Built for agencies, responders, and communities under pressure.</h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                  ResQNet combines human coordination, AI decision support, and operational visibility to help agencies act faster, allocate resources more intelligently, and keep communities informed when emergencies evolve.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="mb-4 inline-flex rounded-2xl bg-red-500/10 p-3 text-red-300"><IconAlert className="h-5 w-5" /></div>
                  <div className="text-3xl font-bold text-white">30-50%</div>
                  <div className="mt-2 text-sm text-slate-300">Potential reduction in response time through faster dispatch and route optimization.</div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="mb-4 inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-300"><IconMap className="h-5 w-5" /></div>
                  <div className="text-3xl font-bold text-white">18</div>
                  <div className="mt-2 text-sm text-slate-300">Districts and agencies connected in a single operational command view.</div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="mb-4 inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-300"><IconShield className="h-5 w-5" /></div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="mt-2 text-sm text-slate-300">Monitoring and alerting with role-based access, audit logs, and policy enforcement.</div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <div className="mb-4 inline-flex rounded-2xl bg-amber-500/10 p-3 text-amber-300"><IconCheck className="h-5 w-5" /></div>
                  <div className="text-3xl font-bold text-white">AA</div>
                  <div className="mt-2 text-sm text-slate-300">Accessibility-first design supporting keyboard, high contrast, and clear status cues.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/80 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Contact</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Ready to modernize emergency coordination?</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">Talk with our team about deployment, regional readiness, and secure integrations for public safety operations.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Emergency response hotline</div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">+1 (800) 555-RESQ</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Operations center</div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">24/7</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <div className="text-sm text-slate-500">Email</div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">operations@resqnet.example</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-semibold text-slate-900">ResQNet</span>
          </div>
          <div>Connecting Help. Saving Time. Protecting Lives.</div>
        </div>
      </footer>
    </div>
  );
}

function IconPulse({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 12H7L10 5L14 19L17 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTruck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 7.5C3 6.7 3.7 6 4.5 6H14.8C15.5 6 16.2 6.3 16.7 6.9L18.7 9.2C19.3 9.9 19.6 10.8 19.6 11.7V15.5C19.6 16.3 18.9 17 18.1 17H17.2C16.8 18.3 15.7 19.2 14.4 19.2C13.1 19.2 12 18.3 11.6 17H9.4C9 18.3 7.9 19.2 6.6 19.2C5.3 19.2 4.2 18.3 3.8 17H3.5C2.7 17 2 16.3 2 15.5V9.5C2 8.1 3.1 7 4.5 7H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="1.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="15" cy="17" r="1.7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 10H14.5V14H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 3.5L18.5 6V11.3C18.5 15.8 15.9 19.7 12 20.9C8.1 19.7 5.5 15.8 5.5 11.3V6L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.3 12.2L11.1 14L14.8 10.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMap({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 4L3.5 6.4V19.5L9 17L15 19.5L20.5 17V3.9L15 6.4L9 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4V17M15 6.4V19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconHospital({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 4.5H17C18.1 4.5 19 5.4 19 6.5V19.5H5V6.5C5 5.4 5.9 4.5 7 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 11H15M12 8V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.5 19.5H20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 18C4.8 15.9 6.6 14.7 9 14.7C11.4 14.7 13.2 15.9 14 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 17.3C16.2 16.5 17.4 15.9 18.8 15.9C19.7 15.9 20.5 16.2 21 16.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconAlert({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 4L19.5 17.5C19.9 18.3 19.4 19.2 18.5 19.2H5.5C4.6 19.2 4.1 18.3 4.5 17.5L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9V13.5M12 16.2H12.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 12.5L9.2 16.7L19 6.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
