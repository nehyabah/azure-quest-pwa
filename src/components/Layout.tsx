import { Link, NavLink, useLocation } from "react-router-dom";
import { BookOpen, BriefcaseBusiness, Gauge, History, Moon, Settings, Sun, Wifi, WifiOff } from "lucide-react";
import { cn } from "../lib/utils";
import { useAppStore } from "../store/useAppStore";
import { Switch } from "./ui/switch";
import { MICROSOFT_DISCLAIMER } from "./QuestionBankNotice";

const navItems = [
  { to: "/cert/sc-300/knowledge", label: "Exams", icon: BookOpen },
  { to: "/cert/sc-300/readiness", label: "Exam Readiness", icon: Gauge },
  { to: "/cert/sc-300/job", label: "Job Readiness", icon: BriefcaseBusiness },
  { to: "/history?cert=SC-300", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings }
];

function currentCertFromPath(pathname: string) {
  if (pathname.includes("az-500") || pathname.includes("AZ-500")) return "az-500";
  if (pathname.includes("sc-500") || pathname.includes("SC-500")) return "sc-500";
  return "sc-300";
}

function pageTitleFromPath(pathname: string): string {
  if (pathname === "/") return "Paths";
  if (pathname.includes("/knowledge")) return "Exams";
  if (pathname.includes("/readiness")) return "Readiness";
  if (pathname.includes("/job")) return "Job Ready";
  if (pathname.includes("/arena")) return "Practice";
  if (pathname.includes("/flashcards")) return "Flashcards";
  if (pathname.includes("/history")) return "History";
  if (pathname.includes("/cases")) return "Case Files";
  if (pathname.includes("/kql")) return "KQL Gym";
  if (pathname.includes("/study")) return "Study";
  if (pathname.includes("/learn")) return "Learn";
  if (pathname.includes("/cert/")) return "Overview";
  return "Azure Quest";
}

export function Layout({ children }: { children: React.ReactNode }) {
  const settings = useAppStore((state) => state.settings);
  const setSettings = useAppStore((state) => state.setSettings);
  const { pathname } = useLocation();
  const certSlug = currentCertFromPath(pathname);
  const mobileNav = navItems.map((item) => ({ ...item, to: item.to.replace("sc-300", certSlug).replace("SC-300", certSlug.toUpperCase()) }));
  const pageTitle = pageTitleFromPath(pathname);

  return (
    <div className={cn(
      "min-h-screen text-slate-950 dark:text-white",
      settings.lowBandwidth
        ? "bg-slate-50 dark:bg-slate-950"
        : "bg-[linear-gradient(180deg,#ffffff,#f5f9ff)] dark:bg-[linear-gradient(180deg,#07111f,#0b1728)]"
    )}>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-blue-900/50 dark:bg-slate-950/95">
        {/* Mobile app bar */}
        <div className="flex h-14 items-center justify-between px-4 sm:hidden">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-blue-700 text-sm font-bold text-white shadow-sm dark:bg-blue-500">AQ</span>
            <span className="text-base">Azure Quest</span>
          </Link>
          <button
            onClick={() => void setSettings({ darkMode: !settings.darkMode })}
            className="grid h-9 w-9 place-items-center rounded-md border border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
            aria-label="Toggle dark mode"
          >
            {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>

        {/* Desktop header */}
        <div className="mx-auto hidden max-w-6xl items-center justify-between px-4 py-3 sm:flex">
          <Link to="/" className="flex min-w-0 items-center gap-2 font-semibold">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-blue-700 text-lg text-white shadow-sm dark:bg-blue-500">AQ</span>
            <span className="min-w-0">
              <span className="block truncate">Azure Quest</span>
              <span className="block text-xs font-extrabold text-slate-500 dark:text-slate-400">Practice exams · interview readiness</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            <Link to={`/cert/${certSlug}/knowledge`} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-500/10 dark:hover:text-blue-100">Exams</Link>
            <Link to={`/cert/${certSlug}/readiness`} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-500/10 dark:hover:text-blue-100">Exam Readiness</Link>
            <Link to={`/cert/${certSlug}/job`} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-500/10 dark:hover:text-blue-100">Job Readiness</Link>
            <Link to={`/history?cert=${certSlug.toUpperCase()}`} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-500/10 dark:hover:text-blue-100">History</Link>
            <Link to="/settings" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-500/10 dark:hover:text-blue-100">Settings</Link>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold dark:border-blue-900 dark:bg-blue-950 md:flex">
              {settings.lowBandwidth ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              <Switch checked={settings.lowBandwidth} onCheckedChange={(v) => void setSettings({ lowBandwidth: v })} label="Low bandwidth" />
            </div>
            <div className="flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold dark:border-blue-900 dark:bg-blue-950">
              {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <Switch checked={settings.darkMode} onCheckedChange={(v) => void setSettings({ darkMode: v })} label="Dark mode" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 sm:pb-10">
        {children}
        <footer className="mt-8 border-t border-slate-200 pt-4 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
          {MICROSOFT_DISCLAIMER}
        </footer>
      </main>

      <nav className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-card backdrop-blur dark:border-blue-900/60 dark:bg-slate-950/95 sm:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-center text-[0.58rem] font-semibold leading-tight transition",
                    isActive
                      ? "bg-blue-50 text-blue-800 shadow-sm dark:bg-blue-950 dark:text-blue-100"
                      : "text-slate-500 dark:text-slate-400"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
