import Link from "next/link";
import { DashboardShell, Panel } from "@/components/Shell";

const links = [
  ["/admin/users", "Users and devices"],
  ["/admin/payments", "Payment approvals"],
  ["/admin/plans", "Pricing plans"],
  ["/admin/tickets", "Support tickets"],
  ["/admin/guides", "Recovery guides"],
  ["/admin/analytics", "Analytics and logs"]
];

export default function AdminPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map(([href, label]) => (
          <Panel key={href}>
            <Link className="font-black text-cyan" href={href}>{label}</Link>
            <p className="mt-2 text-sm text-slate-400">Admin-only workflow with audit logging on API actions.</p>
          </Panel>
        ))}
      </div>
    </DashboardShell>
  );
}
