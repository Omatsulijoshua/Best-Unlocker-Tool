import { LoginForm } from "@/components/AuthForms";
import { Panel, SiteHeader } from "@/components/Shell";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-ink">
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-12">
        <Panel>
          <h1 className="mb-6 text-2xl font-black">Website login</h1>
          <LoginForm />
        </Panel>
      </div>
    </main>
  );
}
