import { WizardClient } from "@/components/WizardClient";
import { DashboardShell, Panel, WarningBanner } from "@/components/Shell";

export default function WizardPage() {
  return (
    <DashboardShell>
      <WarningBanner />
      <Panel className="mt-4">
        <h1 className="mb-4 text-2xl font-black">Recovery wizard</h1>
        <WizardClient />
      </Panel>
    </DashboardShell>
  );
}
