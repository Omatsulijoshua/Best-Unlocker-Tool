import { PasswordGenerator } from "@/components/PasswordTools";
import { DashboardShell, Panel } from "@/components/Shell";

export default function PasswordGeneratorPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Random strong password generator</h1>
        <PasswordGenerator />
      </Panel>
    </DashboardShell>
  );
}
