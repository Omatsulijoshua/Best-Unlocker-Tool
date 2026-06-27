import Link from "next/link";
import { DashboardShell, Panel } from "@/components/Shell";
import { guides } from "@/lib/content";

export default function GuidesPage() {
  return (
    <DashboardShell>
      <div className="mb-4">
        <h1 className="text-2xl font-black">Recovery guides</h1>
        <p className="text-sm text-slate-400">Safe, official recovery paths only.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <Panel key={guide.slug}>
            <h2 className="font-black">{guide.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{guide.excerpt}</p>
            <Link className="mt-4 inline-block text-sm font-black text-cyan" href={`/guides/${guide.slug}`}>Read guide</Link>
          </Panel>
        ))}
      </div>
    </DashboardShell>
  );
}
