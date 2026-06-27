import { DashboardShell, Panel } from "@/components/Shell";

const actions = ["Approve/reject users", "Verify email", "Block/unblock accounts", "Reset linked PC/device", "View active sessions", "View device fingerprint"];

export default function AdminUsersPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Admin users</h1>
        <div className="grid gap-2 md:grid-cols-2">
          {actions.map((action) => <div key={action} className="rounded-lg border border-line bg-ink p-3 text-sm text-slate-300">{action}</div>)}
        </div>
      </Panel>
    </DashboardShell>
  );
}
