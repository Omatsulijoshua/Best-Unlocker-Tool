import { DashboardShell, Panel } from "@/components/Shell";

export default function AdminPaymentsPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Payment approvals</h1>
        <p className="text-slate-400">Payments remain pending until an admin approves them. Approval creates or activates a license with start date, expiry date, and plan type.</p>
      </Panel>
    </DashboardShell>
  );
}
