export const guideCategories = [
  "Windows recovery",
  "Linux and server access",
  "Email and identity accounts",
  "Router and WiFi admin",
  "Developer tooling",
  "Business handover"
];

export const guides = [
  {
    slug: "recover-microsoft-account",
    title: "Recover a Microsoft account safely",
    category: "Email and identity accounts",
    excerpt: "Use Microsoft account recovery, trusted devices, and proof of ownership.",
    body: "Start with the official Microsoft recovery form, use a trusted device and network, confirm recovery email or phone ownership, and rotate passwords after access is restored. Do not use bypass tools or credential dumps."
  },
  {
    slug: "recover-ssh-through-cloud-console",
    title: "Recover SSH access through your cloud provider",
    category: "Developer tooling",
    excerpt: "Regain access with provider consoles, snapshots, and authorized key rotation.",
    body: "Confirm ownership in the provider portal, snapshot the server, use the cloud serial console or rescue mode, add a new authorized key, then rotate any potentially exposed credentials."
  },
  {
    slug: "employee-left-with-admin-passwords",
    title: "When an employee leaves with admin passwords",
    category: "Business handover",
    excerpt: "Contain risk, prove ownership, rotate credentials, and document recovery.",
    body: "Disable the employee account, recover access through official ownership channels, rotate privileged passwords, review audit logs, and create an emergency access register."
  }
];

export const plans = [
  { name: "Starter", description: "Single approved device and guided recovery resources.", priceCents: 1900, durationDays: 30 },
  { name: "Professional", description: "Priority tickets, recovery checklists, and longer license window.", priceCents: 4900, durationDays: 90 },
  { name: "Business", description: "Team support, handover templates, and admin-managed assistance.", priceCents: 14900, durationDays: 365 }
];
