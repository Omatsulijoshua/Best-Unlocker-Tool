import { DashboardShell, Panel } from "@/components/Shell";

const checks = ["User exists", "Email verified", "Admin approved", "Payment approved", "Subscription active", "Device allowed"];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <h1 className="mb-3 text-2xl font-black">User dashboard</h1>
          <p className="text-slate-400">Track recovery work, support tickets, password reminders, and license readiness.</p>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-black">Mandatory app checks</h2>
          <div className="grid gap-2">
            {checks.map((check) => <div key={check} className="rounded-md border border-line bg-ink p-2 text-sm text-slate-300">{check}</div>)}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
