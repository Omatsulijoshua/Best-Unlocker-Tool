"use client";

import { useState } from "react";
import { Brush, Cable, CheckCircle2, Info, RotateCcw, ShieldAlert, Smartphone } from "lucide-react";
import type { AutoModeAction, ConnectedDevice } from "@/lib/autoMode";

declare global {
  interface Window {
    bestUnlockerDesktop?: {
      isDesktop: boolean;
      detectDevice: () => Promise<ConnectedDevice>;
      buildSafePlan: (payload: unknown) => Promise<unknown>;
    };
  }
}

type Plan = {
  allowed: boolean;
  title: string;
  steps: string[];
  warning: string;
  detected: {
    confidence: string;
    summary: string;
    chipset: { family: string; vendor: string };
    model?: { brand: string; name: string };
    details: {
      manufacturer: string;
      product: string;
      serialNumber: string;
      usbVendorId: string;
      usbProductId: string;
      cpuFamily: string;
      storage: string;
      platform: string;
      supportedModes: string[];
      safeOperations: string[];
    };
  };
};

const actions: Array<{ id: AutoModeAction; label: string; description: string }> = [
  { id: "view-device-details", label: "View device details", description: "Show manufacturer, product, CPU family, storage notes, USB IDs, and modes." },
  { id: "official-frp-recovery", label: "FRP recovery", description: "Official account recovery and support escalation only." },
  { id: "factory-reset", label: "Factory reset", description: "Owner-confirmed reset preparation with data-loss warnings." },
  { id: "reboot-recovery", label: "Reboot recovery", description: "Guide or bridge-ready reboot to recovery mode." },
  { id: "reboot-bootloader", label: "Reboot bootloader", description: "Guide or bridge-ready reboot to fastboot/bootloader." }
];

async function requestUsbDevice(): Promise<ConnectedDevice> {
  if (window.bestUnlockerDesktop?.isDesktop) {
    return window.bestUnlockerDesktop.detectDevice();
  }

  const nav = navigator as Navigator & {
    usb?: {
      requestDevice(options: { filters: Array<Record<string, never>> }): Promise<{
        vendorId?: number;
        productId?: number;
        manufacturerName?: string;
        productName?: string;
        serialNumber?: string;
      }>;
    };
  };

  if (!nav.usb) {
    return {
      manufacturerName: "Manual detection",
      productName: "WebUSB not available in this browser"
    };
  }

  const device = await nav.usb.requestDevice({ filters: [{}] });
  return {
    vendorId: device.vendorId,
    productId: device.productId,
    manufacturerName: device.manufacturerName,
    productName: device.productName,
    serialNumber: device.serialNumber
  };
}

export function AutoModeClient() {
  const [device, setDevice] = useState<ConnectedDevice | null>(null);
  const [action, setAction] = useState<AutoModeAction>("official-frp-recovery");
  const [owns, setOwns] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [message, setMessage] = useState("");

  async function detect() {
    setMessage("");
    setPlan(null);
    try {
      const found = await requestUsbDevice();
      setDevice(found);
      setMessage("Device metadata captured. Choose an action to build the safe service plan.");
    } catch {
      setMessage("Device selection was cancelled or blocked. You can still use manual mode.");
    }
  }

  async function buildPlan(selected = action) {
    if (window.bestUnlockerDesktop?.isDesktop) {
      await window.bestUnlockerDesktop.buildSafePlan({
        action: selected,
        ownsOrAdministers: owns,
        device: device ?? { manufacturerName: "Desktop", productName: "Pending device detection" }
      });
    }

    const res = await fetch("/api/auto-mode/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: selected,
        ownsOrAdministers: owns,
        device: device ?? { manufacturerName: "Manual", productName: "Unknown Android device" }
      })
    });
    const data = await res.json();
    setPlan(data.plan);
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-line bg-ink p-4">
        <button onClick={detect} className="flex w-full items-center justify-center gap-3 bg-cyan px-5 py-4 text-lg text-ink">
          <Brush className="h-6 w-6" />
          Auto detect with broom
        </button>
        <p className="mt-3 text-sm text-slate-400">Connect the phone by USB, press the broom button, then choose a safe owner-confirmed service option.</p>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-line bg-ink p-3 text-sm text-slate-300">
        <input className="w-auto" type="checkbox" checked={owns} onChange={(event) => setOwns(event.target.checked)} />
        I confirm this phone belongs to me or I am authorized to service it.
      </label>

      {device ? (
        <div className="grid gap-2 rounded-lg border border-line bg-ink p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-black text-white"><Cable className="h-4 w-4 text-cyan" /> Connected device metadata</div>
          <div>Manufacturer: {device.manufacturerName ?? "Unknown"}</div>
          <div>Product: {device.productName ?? "Unknown"}</div>
          <div>USB ID: {device.vendorId ? `0x${device.vendorId.toString(16)}` : "unknown"}:{device.productId ? `0x${device.productId.toString(16)}` : "unknown"}</div>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {actions.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setAction(item.id);
              void buildPlan(item.id);
            }}
            className={`border px-4 py-4 text-left ${action === item.id ? "border-cyan bg-cyan/10" : "border-line bg-ink"}`}
          >
            <span className="flex items-center gap-2 font-black text-white">
              {item.id === "view-device-details" ? <Info className="h-4 w-4 text-cyan" /> : item.id.includes("reboot") ? <RotateCcw className="h-4 w-4 text-cyan" /> : <Smartphone className="h-4 w-4 text-cyan" />}
              {item.label}
            </span>
            <span className="mt-2 block text-sm font-normal text-slate-400">{item.description}</span>
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-cyan">{message}</p> : null}

      {plan ? (
        <div className="grid gap-4 rounded-lg border border-line bg-ink p-5">
          <div className="flex items-center gap-3">
            {plan.allowed ? <CheckCircle2 className="h-6 w-6 text-cyan" /> : <ShieldAlert className="h-6 w-6 text-red-300" />}
            <div>
              <h2 className="font-black">{plan.title}</h2>
              <p className="text-sm text-slate-400">{plan.detected.summary}</p>
            </div>
          </div>
          <div className="text-sm text-slate-300">
            Profile: {plan.detected.chipset.family} - {plan.detected.model ? `${plan.detected.model.brand} ${plan.detected.model.name}` : "generic Android"}
          </div>
          {action === "view-device-details" ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Manufacturer", plan.detected.details.manufacturer],
                ["Product", plan.detected.details.product],
                ["CPU/chipset", plan.detected.details.cpuFamily],
                ["Platform", plan.detected.details.platform],
                ["USB vendor ID", plan.detected.details.usbVendorId],
                ["USB product ID", plan.detected.details.usbProductId],
                ["Serial", plan.detected.details.serialNumber],
                ["Storage", plan.detected.details.storage]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-line p-3">
                  <div className="text-xs uppercase text-slate-500">{label}</div>
                  <div className="mt-1 text-sm text-slate-200">{value}</div>
                </div>
              ))}
              <div className="rounded-lg border border-line p-3 md:col-span-2">
                <div className="text-xs uppercase text-slate-500">Supported modes</div>
                <div className="mt-1 text-sm text-slate-200">{plan.detected.details.supportedModes.join(", ")}</div>
              </div>
              <div className="rounded-lg border border-line p-3 md:col-span-2">
                <div className="text-xs uppercase text-slate-500">Safe operations</div>
                <div className="mt-1 text-sm text-slate-200">{plan.detected.details.safeOperations.join(", ")}</div>
              </div>
            </div>
          ) : null}
          <ol className="grid gap-2">
            {plan.steps.map((step) => <li key={step} className="rounded-lg border border-line p-3 text-sm text-slate-200">{step}</li>)}
          </ol>
          <div className="rounded-lg border border-cyan/30 bg-cyan/10 p-3 text-sm text-cyan">{plan.warning}</div>
        </div>
      ) : null}
    </div>
  );
}
