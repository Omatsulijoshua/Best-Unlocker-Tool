function detectDevice() {
  return {
    bridge: "desktop",
    status: "bridge-ready",
    manufacturerName: "Desktop bridge",
    productName: "Connect an Android phone and authorize diagnostics",
    serialNumber: undefined,
    note: "This stub is where a signed native ADB/fastboot/OEM diagnostics bridge should be connected. It must revalidate license and ownership before any command."
  };
}

function buildSafePlan(payload) {
  return {
    allowed: Boolean(payload?.ownsOrAdministers),
    action: payload?.action,
    note: "Native execution is intentionally not implemented in this scaffold. Add only owner-authorized, non-bypass commands after server-side license validation."
  };
}

module.exports = {
  detectDevice,
  buildSafePlan
};
