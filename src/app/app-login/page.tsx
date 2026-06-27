import { AppLoginClient } from "@/components/AppLoginClient";
import { Panel, SiteHeader } from "@/components/Shell";

export default function AppLoginPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-12">
        <Panel>
          <h1 className="mb-2 text-2xl font-black">Desktop/mobile app gate</h1>
          <p className="mb-6 text-sm text-slate-400">The app can only unlock after server validation of account approval, payment approval, active license, session, and linked device.</p>
          <AppLoginClient />
        </Panel>
      </div>
    </main>
  );
}
