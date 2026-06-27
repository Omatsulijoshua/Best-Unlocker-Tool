"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LockKeyhole, MonitorCheck } from "lucide-react";

function getDeviceId() {
  const key = "best_unlocker_device_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  localStorage.setItem(key, value);
  return value;
}

export function AppLoginClient() {
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(true);
  const [warning, setWarning] = useState(false);
  const [session, setSession] = useState<{ accessToken: string; sessionId: string } | null>(null);
  const lastActivity = useRef(Date.now());

  const fingerprint = useMemo(() => ({
    platform: typeof navigator !== "undefined" ? navigator.platform : "unknown",
    language: typeof navigator !== "undefined" ? navigator.language : "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: typeof screen !== "undefined" ? `${screen.width}x${screen.height}` : "unknown"
  }), []);

  const markActive = useCallback(() => {
    lastActivity.current = Date.now();
    setWarning(false);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((event) => window.addEventListener(event, markActive));
    const interval = window.setInterval(() => {
      if (!session) return;
      const idleSeconds = (Date.now() - lastActivity.current) / 1000;
      setWarning(idleSeconds >= 240 && idleSeconds < 300);
      if (idleSeconds >= 300) {
        setLocked(true);
        setMessage("App locked after 5 minutes of inactivity. Enter your password again to continue.");
      }
    }, 1000);
    return () => {
      events.forEach((event) => window.removeEventListener(event, markActive));
      window.clearInterval(interval);
    };
  }, [markActive, session]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        deviceId: getDeviceId(),
        fingerprint
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    setSession({ accessToken: data.accessToken, sessionId: data.sessionId });
    setLocked(false);
    markActive();
    setMessage(`License active: ${data.license.plan}. Expires ${new Date(data.license.expiresAt).toLocaleString()}.`);
  }

  async function logout() {
    if (session) {
      await fetch("/api/app/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ sessionId: session.sessionId })
      });
    }
    setSession(null);
    setLocked(true);
    setMessage("Logged out and active session closed.");
  }

  return (
    <div className="grid gap-4">
      {warning ? <div className="rounded-lg border border-cyan bg-cyan/10 p-3 text-sm text-cyan">Idle warning: app locks after 5 minutes. Activity or password unlock is required.</div> : null}
      {locked ? (
        <form onSubmit={submit} className="grid gap-3">
          <div className="flex items-center gap-2 text-slate-300"><LockKeyhole className="h-5 w-5 text-cyan" /> Licensed app login</div>
          <input name="email" type="email" placeholder="Approved account email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button className="bg-cyan px-4 py-3 text-ink" type="submit">Unlock app</button>
        </form>
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-line bg-ink p-4">
            <MonitorCheck className="h-8 w-8 text-cyan" />
            <div>
              <h3 className="font-black">App access granted</h3>
              <p className="text-sm text-slate-400">Server-side license and device checks passed.</p>
            </div>
          </div>
          <button className="border border-line px-4 py-3 text-white" onClick={logout}>Logout and close session</button>
        </div>
      )}
      {message ? <p className="text-sm text-cyan">{message}</p> : null}
    </div>
  );
}
