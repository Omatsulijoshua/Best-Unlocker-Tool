import { notFound } from "next/navigation";
import { DashboardShell, Panel, WarningBanner } from "@/components/Shell";
import { guides } from "@/lib/content";

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) notFound();

  return (
    <DashboardShell>
      <WarningBanner />
      <Panel className="mt-4">
        <p className="mb-2 text-sm text-cyan">{guide.category}</p>
        <h1 className="mb-4 text-3xl font-black">{guide.title}</h1>
        <p className="whitespace-pre-wrap leading-7 text-slate-300">{guide.body}</p>
      </Panel>
    </DashboardShell>
  );
}
