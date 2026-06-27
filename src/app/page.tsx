import Link from "next/link";
import { BookOpen, CheckCircle2, Database, KeyRound, Lock, Server, ShieldAlert, Wifi, type LucideIcon } from "lucide-react";
import { Panel, SiteHeader, WarningBanner } from "@/components/Shell";

const areas: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Windows recovery", icon: Lock },
  { label: "Linux and server access", icon: Server },
  { label: "Email and account recovery", icon: KeyRound },
  { label: "Router and WiFi admin", icon: Wifi },
  { label: "Developer tools and SSH", icon: Database },
  { label: "Password manager setup", icon: BookOpen }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <WarningBanner />
      <section className="cyber-grid border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan/40 px-3 py-1 text-sm text-cyan">
              <ShieldAlert className="h-4 w-4" />
              Licensed legal recovery assistance
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-6xl">Best Unlocker Tool</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              A professional recovery platform for owners, engineers, and IT teams who need safe reset workflows,
              support tickets, documentation, and admin-approved app access.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-lg bg-cyan px-5 py-3 font-black text-ink" href="/register">Create website account</Link>
              <Link className="rounded-lg border border-line px-5 py-3 font-black text-white" href="/guides">Browse guides</Link>
            </div>
          </div>
          <Panel>
            <h2 className="mb-4 text-xl font-black">License gate</h2>
            {["Website signup only", "Admin approval required", "Payment pending until verified", "One active PC per account", "5-minute idle app lock"].map((item) => (
              <div key={item} className="mb-3 flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-cyan" />
                {item}
              </div>
            ))}
          </Panel>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3">
        {areas.map(({ label, icon: Icon }) => (
          <Panel key={label}>
            <Icon className="mb-4 h-7 w-7 text-cyan" />
            <h3 className="font-black">{label}</h3>
            <p className="mt-2 text-sm text-slate-400">Official recovery paths, ownership checks, and secure reset guidance only.</p>
          </Panel>
        ))}
      </section>
    </main>
  );
}
