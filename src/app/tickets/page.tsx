import { DashboardShell, Panel } from "@/components/Shell";

export default function TicketsPage() {
  return (
    <DashboardShell>
      <Panel>
        <h1 className="mb-2 text-2xl font-black">Support tickets</h1>
        <p className="mb-4 text-sm text-slate-400">Upload screenshots or documents only. Do not upload passwords, private keys, seed phrases, or secret credentials.</p>
        <form className="grid gap-3">
          <input placeholder="Title" />
          <select><option>Windows PC</option><option>Linux server</option><option>Email account</option><option>Hosting account</option></select>
          <textarea rows={5} placeholder="Describe the official recovery help you need" />
          <select><option>NORMAL</option><option>HIGH</option><option>URGENT</option><option>LOW</option></select>
          <button className="bg-cyan px-4 py-3 text-ink" type="button">Create ticket draft</button>
        </form>
      </Panel>
    </DashboardShell>
  );
}
