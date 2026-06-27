import { DashboardShell, Panel } from "@/components/Shell";

export default function AdminAnalyticsPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Analytics and logs</h1>
        <p className="text-slate-400">View login history, app usage logs, active sessions, suspicious attempts, and admin action audit trails.</p>
      </Panel>
    </DashboardShell>
  );
}
