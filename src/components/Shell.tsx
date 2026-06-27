import Link from "next/link";
import { Activity, BookOpen, Brush, Cpu, CreditCard, Download, KeyRound, LayoutDashboard, LifeBuoy, ShieldCheck, Users } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/auto-mode", label: "Auto Mode", icon: Brush },
  { href: "/wizard", label: "Wizard", icon: ShieldCheck },
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/devices", label: "Devices", icon: Cpu },
  { href: "/tools/password-generator", label: "Tools", icon: KeyRound },
  { href: "/download", label: "Download", icon: Download },
  { href: "/tickets", label: "Tickets", icon: LifeBuoy },
  { href: "/admin/users", label: "Admin", icon: Users }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-black">
          <ShieldCheck className="h-6 w-6 text-cyan" />
          Best Unlocker Tool
        </Link>
        <nav className="hidden gap-4 text-sm text-slate-300 md:flex">
          <Link href="/guides">Guides</Link>
          <Link href="/auto-mode">Auto Mode</Link>
          <Link href="/devices">Devices</Link>
          <Link href="/download">Download</Link>
          <Link href="/register">Register</Link>
          <Link href="/app-login">App Login</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border border-line bg-panel p-3">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-line p-3 text-sm text-slate-300">
            <Activity className="h-4 w-4 text-cyan" />
            Licensed recovery console
          </div>
          <nav className="grid gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link href="/admin/payments" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
              <CreditCard className="h-4 w-4" />
              Payments
            </Link>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-panel p-5 shadow-glow ${className}`}>{children}</div>;
}

export function WarningBanner() {
  return (
    <div className="border-y border-cyan/30 bg-cyan/10 px-4 py-3 text-center text-sm text-cyan">
      We only help with systems you legally own or administer. We do not bypass security or support unauthorized access.
    </div>
  );
}
