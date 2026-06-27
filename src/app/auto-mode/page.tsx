import { AutoModeClient } from "@/components/AutoModeClient";
import { DashboardShell, Panel, WarningBanner } from "@/components/Shell";

export default function AutoModePage() {
  return (
    <DashboardShell>
      <WarningBanner />
      <Panel className="mt-4">
        <h1 className="mb-2 text-2xl font-black">Automatic phone service mode</h1>
        <p className="mb-5 text-sm text-slate-400">
          Press the broom button after connecting a phone. The tool detects available USB metadata and prepares safe options
          for official FRP/account recovery, factory reset preparation, and reboot guidance.
        </p>
        <AutoModeClient />
      </Panel>
    </DashboardShell>
  );
}
