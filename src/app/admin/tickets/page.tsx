import { DashboardShell, Panel } from "@/components/Shell";

export default function AdminTicketsPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Admin tickets</h1>
        <p className="text-slate-400">Review tickets, reply, request proof of ownership, and reject suspicious or unauthorized requests.</p>
      </Panel>
    </DashboardShell>
  );
}
