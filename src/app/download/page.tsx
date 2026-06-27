import { Download, MonitorDown, ShieldCheck } from "lucide-react";
import { Panel, SiteHeader, WarningBanner } from "@/components/Shell";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <WarningBanner />
      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-12">
        <Panel>
          <div className="flex items-center gap-3">
            <MonitorDown className="h-8 w-8 text-cyan" />
            <div>
              <h1 className="text-2xl font-black">Windows desktop app</h1>
              <p className="mt-1 text-sm text-slate-400">
                Package Best Unlocker Tool as an `.exe` while keeping website signup, admin approval, payments, and licensing on the server.
              </p>
            </div>
          </div>
        </Panel>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Website first", "Users register and pay on the website only."],
            ["Licensed app", "The `.exe` opens the app login gate and validates the backend before use."],
            ["Bridge ready", "Native device diagnostics can be added through a signed desktop bridge."]
          ].map(([title, copy]) => (
            <Panel key={title}>
              <ShieldCheck className="mb-3 h-6 w-6 text-cyan" />
              <h2 className="font-black">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">{copy}</p>
            </Panel>
          ))}
        </div>
        <Panel>
          <h2 className="mb-3 flex items-center gap-2 font-black"><Download className="h-5 w-5 text-cyan" /> Build command</h2>
          <code className="block rounded-lg border border-line bg-ink p-4 text-sm text-cyan">pnpm dist</code>
          <p className="mt-3 text-sm text-slate-400">The generated installer and portable executable will be created in `dist-desktop`.</p>
        </Panel>
      </section>
    </main>
  );
}
