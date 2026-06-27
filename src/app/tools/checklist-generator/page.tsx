import { ChecklistGenerator } from "@/components/PasswordTools";
import { DashboardShell, Panel } from "@/components/Shell";

export default function ChecklistGeneratorPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Recovery checklist generator</h1>
        <ChecklistGenerator />
      </Panel>
    </DashboardShell>
  );
}
