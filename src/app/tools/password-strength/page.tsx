import { PasswordStrength } from "@/components/PasswordTools";
import { DashboardShell, Panel } from "@/components/Shell";

export default function PasswordStrengthPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-4 text-2xl font-black">Password strength checker</h1>
        <PasswordStrength />
      </Panel>
    </DashboardShell>
  );
}
