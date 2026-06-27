"use client";

import { useMemo, useState } from "react";

export function PasswordGenerator() {
  const [length, setLength] = useState(24);
  const [password, setPassword] = useState("");

  function generate() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    setPassword(Array.from(array, (value) => chars[value % chars.length]).join(""));
  }

  return (
    <div className="grid gap-4">
      <input type="range" min={16} max={64} value={length} onChange={(event) => setLength(Number(event.target.value))} />
      <div className="text-sm text-slate-300">Length: {length}</div>
      <button onClick={generate} className="bg-cyan px-4 py-3 text-ink">Generate password</button>
      <code className="block break-all rounded-lg border border-line bg-ink p-4 text-cyan">{password || "Generated password appears here"}</code>
    </div>
  );
}

export function PasswordStrength() {
  const [value, setValue] = useState("");
  const score = useMemo(() => {
    let points = 0;
    if (value.length >= 12) points++;
    if (/[A-Z]/.test(value)) points++;
    if (/[a-z]/.test(value)) points++;
    if (/\d/.test(value)) points++;
    if (/[^A-Za-z0-9]/.test(value)) points++;
    return points;
  }, [value]);
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];

  return (
    <div className="grid gap-4">
      <input value={value} onChange={(event) => setValue(event.target.value)} type="password" placeholder="Type a password to evaluate locally" />
      <div className="h-3 rounded-full bg-ink">
        <div className="h-3 rounded-full bg-cyan" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
      <p className="text-sm text-slate-300">{labels[score]} password. This checker runs in your browser and does not store the password.</p>
    </div>
  );
}

export function ChecklistGenerator() {
  const [context, setContext] = useState("employee handover");
  const items = [
    `Confirm ownership and authority for ${context}.`,
    "Inventory admin accounts, recovery emails, and 2FA owners.",
    "Rotate privileged passwords through official portals.",
    "Regenerate backup codes and store them in an approved password manager.",
    "Record evidence, dates, and responsible approvers."
  ];
  return (
    <div className="grid gap-4">
      <input value={context} onChange={(event) => setContext(event.target.value)} />
      <ul className="grid gap-2">
        {items.map((item) => <li key={item} className="rounded-lg border border-line bg-ink p-3 text-sm text-slate-200">{item}</li>)}
      </ul>
    </div>
  );
}
