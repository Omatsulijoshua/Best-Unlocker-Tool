import { DashboardShell, Panel } from "@/components/Shell";
import { plans } from "@/lib/content";

export default function AdminPlansPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Panel key={plan.name}>
            <h1 className="font-black">{plan.name}</h1>
            <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
            <p className="mt-4 text-cyan">${(plan.priceCents / 100).toFixed(2)} / {plan.durationDays} days</p>
          </Panel>
        ))}
      </div>
    </DashboardShell>
  );
}
