"use client";

import { useState } from "react";
import { buildGuidance } from "@/lib/wizard";

const systems = ["Windows PC", "Linux server", "Email account", "Website admin panel", "Hosting account", "Database", "Router/WiFi", "GitHub/GitLab", "SSH key", "Business software"];
const proofOptions = ["Recovery email", "Phone number", "Backup codes", "Admin access", "Recovery drive", "Password manager backup", "Hosting provider access"];

export function WizardClient() {
  const [systemType, setSystemType] = useState(systems[0]);
  const [owns, setOwns] = useState(false);
  const [proof, setProof] = useState<string[]>([]);
  const guidance = buildGuidance({ systemType, ownsOrAdministers: owns, proof });

  return (
    <div className="grid gap-4">
      <select value={systemType} onChange={(event) => setSystemType(event.target.value)}>
        {systems.map((system) => <option key={system}>{system}</option>)}
      </select>
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input className="w-auto" type="checkbox" checked={owns} onChange={(event) => setOwns(event.target.checked)} />
        I legally own or administer this system.
      </label>
      <div className="grid gap-2 md:grid-cols-2">
        {proofOptions.map((item) => (
          <label key={item} className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm">
            <input className="w-auto" type="checkbox" checked={proof.includes(item)} onChange={(event) => {
              setProof((current) => event.target.checked ? [...current, item] : current.filter((value) => value !== item));
            }} />
            {item}
          </label>
        ))}
      </div>
      <pre className="whitespace-pre-wrap rounded-lg border border-line bg-ink p-4 text-sm text-slate-200">{guidance}</pre>
    </div>
  );
}
