import { DashboardShell, Panel } from "@/components/Shell";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <Panel>
        <p className="text-sm text-cyan">Ticket {params.id}</p>
        <h1 className="mb-4 text-2xl font-black">Ticket conversation</h1>
        <div className="rounded-lg border border-line bg-ink p-4 text-sm text-slate-300">
          Admin replies, ownership proof checklist, status changes, and attachment warnings appear here.
        </div>
      </Panel>
    </DashboardShell>
  );
}
