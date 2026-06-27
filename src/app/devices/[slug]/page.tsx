import { notFound } from "next/navigation";
import { DashboardShell, Panel, WarningBanner } from "@/components/Shell";
import { deviceChipsets, deviceModels } from "@/lib/devices";

export default function DeviceModelPage({ params }: { params: { slug: string } }) {
  const model = deviceModels.find((item) => item.slug === params.slug);
  if (!model) notFound();
  const chipset = deviceChipsets.find((item) => item.slug === model.chipsetSlug);

  return (
    <DashboardShell>
      <WarningBanner />
      <Panel className="mt-4">
        <p className="text-sm text-cyan">{model.brand} · {chipset?.family}</p>
        <h1 className="mt-1 text-3xl font-black">{model.name}</h1>
        <p className="mt-3 text-sm text-slate-400">Aliases: {model.aliases.join(", ")}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section>
            <h2 className="mb-2 font-black">Supported safe modes</h2>
            <ul className="grid gap-2">
              {model.supportedModes.map((item) => <li className="rounded-lg border border-line bg-ink p-3 text-sm text-slate-300" key={item}>{item}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="mb-2 font-black">Safe operations</h2>
            <ul className="grid gap-2">
              {model.safeOperations.map((item) => <li className="rounded-lg border border-line bg-ink p-3 text-sm text-slate-300" key={item}>{item}</li>)}
            </ul>
          </section>
        </div>
        <div className="mt-6 grid gap-4">
          <div className="rounded-lg border border-line bg-ink p-4 text-sm text-slate-300">{model.officialNotes}</div>
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{model.riskNotes}</div>
        </div>
      </Panel>
    </DashboardShell>
  );
}
