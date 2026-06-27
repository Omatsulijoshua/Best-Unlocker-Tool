const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bestUnlockerDesktop", {
  isDesktop: true,
  detectDevice: () => ipcRenderer.invoke("device:detect"),
  buildSafePlan: (payload) => ipcRenderer.invoke("device:plan", payload)
});
