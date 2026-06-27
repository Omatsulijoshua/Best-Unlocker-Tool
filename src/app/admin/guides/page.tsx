import { DashboardShell, Panel } from "@/components/Shell";

export default function AdminGuidesPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Manage recovery guides</h1>
        <p className="text-slate-400">Create, edit, publish, and categorize safe recovery articles. Exploit-based methods are out of scope.</p>
      </Panel>
    </DashboardShell>
  );
}
