const suspiciousTerms = ["bypass", "hack", "crack", "steal", "keylogger", "exploit", "bruteforce", "brute force"];

export function containsSuspiciousRequest(text: string) {
  const lower = text.toLowerCase();
  return suspiciousTerms.some((term) => lower.includes(term));
}

export function buildGuidance(input: {
  systemType: string;
  ownsOrAdministers: boolean;
  proof: string[];
}) {
  if (!input.ownsOrAdministers) {
    return "We cannot help access systems you do not own or administer. Contact the rightful owner or service provider.";
  }

  const proof = new Set(input.proof);
  const steps = [
    `Confirm ownership for the ${input.systemType} before any recovery attempt.`,
    "Use the official recovery path from the vendor, hosting provider, or account portal.",
    "Document each step and avoid sharing passwords, private keys, seed phrases, or recovery codes in tickets."
  ];

  if (proof.has("Recovery email") || proof.has("Phone number")) {
    steps.push("Use your recovery email or phone number to complete identity verification.");
  }
  if (proof.has("Backup codes")) {
    steps.push("Use one backup code, then regenerate and store a fresh set after access is restored.");
  }
  if (proof.has("Admin access") || proof.has("Hosting provider access")) {
    steps.push("Use your admin console to reset access, rotate credentials, and review audit logs.");
  }
  if (proof.has("Recovery drive") || proof.has("Password manager backup")) {
    steps.push("Restore from your recovery drive or password manager backup, then update stale entries.");
  }

  return steps.join("\n");
}
