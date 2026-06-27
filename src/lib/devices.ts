export type DeviceChipsetSeed = {
  family: "MTK" | "SPD/Unisoc" | "Snapdragon";
  vendor: string;
  slug: string;
  description: string;
  safeNotes: string;
};

export type DeviceModelSeed = {
  brand: string;
  name: string;
  slug: string;
  chipsetSlug: string;
  aliases: string[];
  platform: string;
  supportedModes: string[];
  safeOperations: string[];
  officialNotes: string;
  riskNotes: string;
};

export const deviceChipsets: DeviceChipsetSeed[] = [
  {
    family: "MTK",
    vendor: "MediaTek",
    slug: "mediatek-mtk",
    description: "MediaTek based Android devices across Transsion, Xiaomi, Oppo, Vivo, Nokia, Lenovo, and other brands.",
    safeNotes: "Use official OEM firmware, authorized service procedures, signed updates, and owner-confirmed data backup workflows."
  },
  {
    family: "SPD/Unisoc",
    vendor: "Unisoc",
    slug: "unisoc-spd",
    description: "Spreadtrum/Unisoc based Android feature phones and smartphones, including many entry-level devices.",
    safeNotes: "Use signed vendor firmware and manufacturer-approved recovery paths. Avoid unauthorized lock bypass or credential removal."
  },
  {
    family: "Snapdragon",
    vendor: "Qualcomm",
    slug: "qualcomm-snapdragon",
    description: "Qualcomm Snapdragon Android devices from Samsung, Xiaomi, OnePlus, Motorola, Nokia, and others.",
    safeNotes: "Prefer official fastboot/recovery tools, OEM unlock policies, account recovery, warranty-safe diagnostics, and service center escalation."
  }
];

export const deviceModels: DeviceModelSeed[] = [
  {
    brand: "Samsung",
    name: "Galaxy A-series Snapdragon variants",
    slug: "samsung-galaxy-a-snapdragon",
    chipsetSlug: "qualcomm-snapdragon",
    aliases: ["Galaxy A52", "Galaxy A72", "Galaxy A23 5G"],
    platform: "Android",
    supportedModes: ["Recovery", "Download mode", "ADB when previously authorized"],
    safeOperations: ["Official account recovery", "Factory reset with owner consent", "Firmware verification", "Backup and restore guidance"],
    officialNotes: "Use Samsung account recovery, Find My Mobile where configured, Smart Switch backups, and official firmware channels.",
    riskNotes: "Do not attempt FRP bypass, unauthorized account removal, or unsigned flashing."
  },
  {
    brand: "Xiaomi",
    name: "Redmi/POCO MTK variants",
    slug: "xiaomi-redmi-poco-mtk",
    chipsetSlug: "mediatek-mtk",
    aliases: ["Redmi 9A", "Redmi 10A", "POCO C-series"],
    platform: "Android",
    supportedModes: ["Recovery", "Fastboot where available", "ADB when previously authorized"],
    safeOperations: ["Mi account recovery", "Official bootloader unlock guidance", "Signed firmware matching", "Data backup checklist"],
    officialNotes: "Use Xiaomi account recovery and official unlock policies. Match region and model before any firmware action.",
    riskNotes: "Avoid auth bypass tools, test-point exploit flows, or firmware from untrusted sources."
  },
  {
    brand: "Tecno",
    name: "Spark and Camon MTK variants",
    slug: "tecno-spark-camon-mtk",
    chipsetSlug: "mediatek-mtk",
    aliases: ["Spark 8", "Spark 10", "Camon 19", "Camon 20"],
    platform: "Android",
    supportedModes: ["Recovery", "ADB when previously authorized"],
    safeOperations: ["Google account recovery", "OEM support escalation", "Owner-approved reset checklist", "Backup guidance"],
    officialNotes: "Use Transsion support resources, Google account recovery, and authorized service channels.",
    riskNotes: "Do not provide FRP bypass, credential removal, or exploit-based flashing steps."
  },
  {
    brand: "Infinix",
    name: "Hot/Note MTK variants",
    slug: "infinix-hot-note-mtk",
    chipsetSlug: "mediatek-mtk",
    aliases: ["Hot 10", "Hot 12", "Note 11", "Note 12"],
    platform: "Android",
    supportedModes: ["Recovery", "ADB when previously authorized"],
    safeOperations: ["Google account recovery", "Official reset preparation", "Firmware identification", "Support ticket checklist"],
    officialNotes: "Confirm exact model and region, then use official Transsion support or OTA recovery where possible.",
    riskNotes: "Avoid unauthorized lock removal, private-key extraction, or exploit loaders."
  },
  {
    brand: "itel",
    name: "A-series SPD/Unisoc variants",
    slug: "itel-a-series-spd-unisoc",
    chipsetSlug: "unisoc-spd",
    aliases: ["itel A16", "itel A56", "itel A60", "itel P-series"],
    platform: "Android",
    supportedModes: ["Recovery", "ADB when previously authorized"],
    safeOperations: ["Google account recovery", "Proof-of-ownership reset guidance", "Service center handoff", "Data-loss warning"],
    officialNotes: "Use Transsion/itel support channels and owner-approved reset procedures.",
    riskNotes: "Do not include PAC exploit methods, FRP bypass, or unauthorized account removal."
  },
  {
    brand: "Nokia",
    name: "Nokia Android Qualcomm/Unisoc variants",
    slug: "nokia-android-qualcomm-unisoc",
    chipsetSlug: "qualcomm-snapdragon",
    aliases: ["Nokia 5.4", "Nokia G20", "Nokia C-series"],
    platform: "Android",
    supportedModes: ["Recovery", "Fastboot where supported", "ADB when previously authorized"],
    safeOperations: ["Google account recovery", "Official support escalation", "Signed OTA recovery", "Backup review"],
    officialNotes: "Use HMD/Nokia support documentation and verified OTA or recovery packages.",
    riskNotes: "Avoid unauthorized unlock, exploit EDL flows, or account bypass."
  },
  {
    brand: "OnePlus",
    name: "OnePlus Snapdragon devices",
    slug: "oneplus-snapdragon",
    chipsetSlug: "qualcomm-snapdragon",
    aliases: ["OnePlus 7", "OnePlus 8", "OnePlus Nord"],
    platform: "Android",
    supportedModes: ["Recovery", "Fastboot", "ADB when previously authorized"],
    safeOperations: ["Official bootloader unlock guidance", "Account recovery", "Backup before reset", "Firmware integrity check"],
    officialNotes: "Follow OnePlus official unlock and recovery documentation. Warn users that bootloader unlock may erase data.",
    riskNotes: "Do not provide EDL exploit packs, MSM unauthorized flows, or lock bypass steps."
  },
  {
    brand: "Motorola",
    name: "Moto Snapdragon/MediaTek variants",
    slug: "motorola-moto-android",
    chipsetSlug: "qualcomm-snapdragon",
    aliases: ["Moto G Power", "Moto E", "Moto G Stylus"],
    platform: "Android",
    supportedModes: ["Recovery", "Fastboot", "ADB when previously authorized"],
    safeOperations: ["Google account recovery", "Motorola bootloader policy check", "Rescue and Smart Assistant guidance", "Backup checklist"],
    officialNotes: "Use Motorola rescue tools, account recovery, and official bootloader policy pages.",
    riskNotes: "Avoid unauthorized FRP removal or exploit-based blankflash instructions."
  }
];

export function searchDeviceModels(query: string) {
  const needle = query.toLowerCase();
  return deviceModels.filter((model) =>
    [model.brand, model.name, model.platform, ...model.aliases].some((value) => value.toLowerCase().includes(needle))
  );
}
