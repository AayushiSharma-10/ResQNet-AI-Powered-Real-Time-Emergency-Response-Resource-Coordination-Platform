"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type WorkspaceUser = {
  firstName?: string;
  lastName?: string;
  role: string;
};

const roleLabels: Record<string, string> = {
  CITIZEN: "Citizen workspace",
  RESPONDER: "Responder workspace",
  DISPATCHER: "Dispatch center",
  HOSPITAL: "Hospital workspace",
  ADMINISTRATOR: "Administration",
  EMERGENCY_AUTHORITY: "Emergency authority",
};

const roleNavigation: Record<string, Array<{ label: string; href: string }>> = {
  CITIZEN: [
    { label: "My reports", href: "/dashboard" },
    { label: "All my incidents", href: "/incidents" },
    { label: "Report emergency", href: "/incidents/new" },
  ],
  RESPONDER: [
    { label: "Response overview", href: "/dashboard" },
    { label: "Assigned incidents", href: "/incidents" },
  ],
  DISPATCHER: [
    { label: "Operations", href: "/dashboard" },
    { label: "Incidents", href: "/incidents" },
    { label: "Report incident", href: "/incidents/new" },
    { label: "Analytics", href: "/analytics" },
  ],
  HOSPITAL: [
    { label: "Care coordination", href: "/dashboard" },
    { label: "Incidents", href: "/incidents" },
  ],
  ADMINISTRATOR: [
    { label: "Overview", href: "/dashboard" },
    { label: "Incidents", href: "/incidents" },
    { label: "Report incident", href: "/incidents/new" },
    { label: "Analytics", href: "/analytics" },
  ],
  EMERGENCY_AUTHORITY: [
    { label: "Situation overview", href: "/dashboard" },
    { label: "Incidents", href: "/incidents" },
    { label: "Analytics", href: "/analytics" },
  ],
};

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<WorkspaceUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("resqnet-token");
    const storedUser = window.localStorage.getItem("resqnet-user");
    if (!token || !storedUser) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      setUser(JSON.parse(storedUser) as WorkspaceUser);
      setReady(true);
    } catch {
      window.localStorage.removeItem("resqnet-user");
      window.localStorage.removeItem("resqnet-token");
      router.replace("/login");
    }
  }, [pathname, router]);

  const navigateBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/dashboard");
  };

  const logout = () => {
    window.localStorage.removeItem("resqnet-user");
    window.localStorage.removeItem("resqnet-token");
    router.replace("/");
  };

  if (!ready || !user) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">Loading your secure workspace…</main>;
  }

  const navigation = roleNavigation[user.role] ?? roleNavigation.CITIZEN;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 font-bold text-white">R</span>
            <span>
              <span className="block font-bold leading-5">ResQNet</span>
              <span className="block text-xs text-slate-500">{roleLabels[user.role] ?? "Secure workspace"}</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{name || roleLabels[user.role]}</span>
            <button type="button" onClick={navigateBack} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100" aria-label="Go back">
              Back
            </button>
            <button type="button" onClick={logout} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Workspace navigation" className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3">
          {navigation.map((item) => {
            const active = pathname === item.href
              || (item.href !== "/dashboard" && item.href !== "/incidents/new" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
    </div>
  );
}
