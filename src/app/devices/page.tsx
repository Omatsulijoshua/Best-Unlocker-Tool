import Link from "next/link";
import { Cpu } from "lucide-react";
import { DashboardShell, Panel, WarningBanner } from "@/components/Shell";
import { deviceChipsets, deviceModels } from "@/lib/devices";

export default function DevicesPage() {
  return (
    <DashboardShell>
      <WarningBanner />
      <div className="mt-4 grid gap-4">
        <Panel>
          <h1 className="mb-2 text-2xl font-black">Device and chipset support</h1>
          <p className="text-sm text-slate-400">
            Searchable support coverage for common free MTK, SPD/Unisoc, and Snapdragon recovery workflows. This catalog
            contains safe diagnostics, official reset guidance, firmware verification notes, and support handoff details.
          </p>
        </Panel>
        <div className="grid gap-4 md:grid-cols-3">
          {deviceChipsets.map((chipset) => (
            <Panel key={chipset.slug}>
              <Cpu className="mb-3 h-6 w-6 text-cyan" />
              <h2 className="font-black">{chipset.family}</h2>
              <p className="mt-2 text-sm text-slate-400">{chipset.description}</p>
            </Panel>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {deviceModels.map((model) => (
            <Panel key={model.slug}>
              <p className="text-sm text-cyan">{model.brand} · {model.platform}</p>
              <h2 className="mt-1 font-black">{model.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{model.aliases.join(", ")}</p>
              <Link className="mt-4 inline-block text-sm font-black text-cyan" href={`/devices/${model.slug}`}>View safe support notes</Link>
            </Panel>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
