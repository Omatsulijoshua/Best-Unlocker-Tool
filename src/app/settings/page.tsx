import { DashboardShell, Panel } from "@/components/Shell";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Settings</h1>
        <p className="text-slate-400">Manage profile information, password rotation reminders, and notification preferences.</p>
      </Panel>
    </DashboardShell>
  );
}
