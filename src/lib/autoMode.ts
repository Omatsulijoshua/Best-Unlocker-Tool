import { deviceChipsets, deviceModels } from "@/lib/devices";

export type ConnectedDevice = {
  vendorId?: number;
  productId?: number;
  manufacturerName?: string;
  productName?: string;
  serialNumber?: string;
};

export type AutoModeAction = "view-device-details" | "official-frp-recovery" | "factory-reset" | "reboot-recovery" | "reboot-bootloader";

const vendorHints: Array<{ match: string; chipsetSlug: string; brand?: string }> = [
  { match: "mediatek", chipsetSlug: "mediatek-mtk" },
  { match: "mtk", chipsetSlug: "mediatek-mtk" },
  { match: "unisoc", chipsetSlug: "unisoc-spd" },
  { match: "spreadtrum", chipsetSlug: "unisoc-spd" },
  { match: "qualcomm", chipsetSlug: "qualcomm-snapdragon" },
  { match: "samsung", chipsetSlug: "qualcomm-snapdragon", brand: "Samsung" },
  { match: "xiaomi", chipsetSlug: "mediatek-mtk", brand: "Xiaomi" },
  { match: "redmi", chipsetSlug: "mediatek-mtk", brand: "Xiaomi" },
  { match: "poco", chipsetSlug: "mediatek-mtk", brand: "Xiaomi" },
  { match: "tecno", chipsetSlug: "mediatek-mtk", brand: "Tecno" },
  { match: "infinix", chipsetSlug: "mediatek-mtk", brand: "Infinix" },
  { match: "itel", chipsetSlug: "unisoc-spd", brand: "itel" },
  { match: "oneplus", chipsetSlug: "qualcomm-snapdragon", brand: "OnePlus" },
  { match: "motorola", chipsetSlug: "qualcomm-snapdragon", brand: "Motorola" }
];

export function identifyConnectedDevice(device: ConnectedDevice) {
  const haystack = [device.manufacturerName, device.productName, device.vendorId?.toString(16), device.productId?.toString(16)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const hint = vendorHints.find((item) => haystack.includes(item.match));
  const chipset = deviceChipsets.find((item) => item.slug === hint?.chipsetSlug) ?? deviceChipsets[0];
  const model =
    deviceModels.find((item) => item.brand.toLowerCase() === hint?.brand?.toLowerCase()) ??
    deviceModels.find((item) => item.chipsetSlug === chipset.slug);

  return {
    chipset,
    model,
    confidence: hint ? "medium" : "low",
    details: {
      manufacturer: device.manufacturerName ?? model?.brand ?? "Unknown manufacturer",
      product: device.productName ?? model?.name ?? "Unknown Android device",
      serialNumber: device.serialNumber ? "Captured from USB metadata" : "Unavailable from browser USB metadata",
      usbVendorId: device.vendorId ? `0x${device.vendorId.toString(16).padStart(4, "0")}` : "Unknown",
      usbProductId: device.productId ? `0x${device.productId.toString(16).padStart(4, "0")}` : "Unknown",
      cpuFamily: `${chipset.vendor} ${chipset.family}`,
      storage: "Requires authorized desktop bridge or OEM diagnostics to read exact storage capacity.",
      platform: model?.platform ?? "Android",
      supportedModes: model?.supportedModes ?? ["Recovery", "ADB when previously authorized"],
      safeOperations: model?.safeOperations ?? ["Official account recovery", "Owner-approved factory reset preparation", "Service center handoff"]
    },
    summary: hint
      ? `Detected ${hint.brand ?? chipset.vendor} family from USB metadata.`
      : "USB metadata was limited, so the tool selected a conservative generic profile."
  };
}

export function buildAutoModePlan(input: {
  action: AutoModeAction;
  ownsOrAdministers: boolean;
  device: ConnectedDevice;
}) {
  const detected = identifyConnectedDevice(input.device);
  if (!input.ownsOrAdministers) {
    return {
      allowed: false,
      detected,
      title: "Ownership confirmation required",
      steps: ["Confirm you legally own or administer this phone before using automatic service mode."],
      warning: "The tool will not prepare reset or FRP recovery guidance without ownership confirmation."
    };
  }

  if (input.action === "view-device-details") {
    return {
      allowed: true,
      detected,
      title: "Device details",
      steps: [
        `Manufacturer: ${detected.details.manufacturer}`,
        `Product/model: ${detected.details.product}`,
        `CPU/chipset family: ${detected.details.cpuFamily}`,
        `Platform: ${detected.details.platform}`,
        `USB vendor/product: ${detected.details.usbVendorId}:${detected.details.usbProductId}`,
        `Serial: ${detected.details.serialNumber}`,
        `Storage: ${detected.details.storage}`
      ],
      warning: "Browser detection can show USB metadata and inferred chipset/model. Exact CPU cores, RAM, storage, build number, and security patch require an authorized desktop bridge or OEM diagnostics."
    };
  }

  if (input.action === "official-frp-recovery") {
    return {
      allowed: true,
      detected,
      title: "Official FRP/account recovery",
      steps: [
        "Confirm the phone owner can access the Google/OEM account recovery email or phone number.",
        "Use the manufacturer or Google account recovery path and wait out any platform-mandated security hold.",
        "Prepare proof of purchase or ownership for OEM support if account recovery fails.",
        "Do not attempt FRP bypass, unauthorized account removal, exploit loaders, or credential extraction."
      ],
      warning: "FRP bypass is not supported. This plan only covers legitimate account recovery and support escalation."
    };
  }

  if (input.action === "factory-reset") {
    return {
      allowed: true,
      detected,
      title: "Factory reset preparation",
      steps: [
        "Warn the owner that local data may be erased.",
        "Check for backups, synced accounts, 2FA access, and recovery codes before reset.",
        `Use official ${detected.model?.brand ?? detected.chipset.vendor} recovery/settings reset instructions for the exact model.`,
        "After reset, sign in with the previously synced owner account if Android protection requires it."
      ],
      warning: "A factory reset can trigger account verification. It does not remove account ownership checks."
    };
  }

  const mode = input.action === "reboot-recovery" ? "recovery" : "bootloader/fastboot";
  return {
    allowed: true,
    detected,
    title: `Reboot to ${mode}`,
    steps: [
      "Confirm USB debugging or authorized service access is available before attempting automated reboot.",
      `Use official key combinations or authorized ADB/service tools to enter ${mode}.`,
      "If the device is not authorized for ADB, show manual key-combination guidance instead.",
      "Do not use exploit-based loaders or unauthorized emergency-download procedures."
    ],
    warning: "Browser-based auto mode can detect USB metadata, but native reboot commands require a trusted desktop bridge."
  };
}
