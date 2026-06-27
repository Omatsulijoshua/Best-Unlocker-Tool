import { RegisterForm } from "@/components/AuthForms";
import { Panel, SiteHeader, WarningBanner } from "@/components/Shell";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <WarningBanner />
      <div className="mx-auto max-w-lg px-4 py-12">
        <Panel>
          <h1 className="mb-2 text-2xl font-black">Website signup</h1>
          <p className="mb-6 text-sm text-slate-400">Accounts are pending until email verification and admin approval. Registration is not available inside the desktop/mobile app.</p>
          <RegisterForm />
        </Panel>
      </div>
    </main>
  );
}
