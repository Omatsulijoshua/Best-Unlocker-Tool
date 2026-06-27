const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("node:path");
const bridge = require("./native-device-bridge.cjs");

const isDev = process.env.NODE_ENV === "development";
const appUrl = process.env.DESKTOP_APP_URL || process.env.NEXT_PUBLIC_WEB_APP_URL || "https://your-domain.example.com";

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    title: "Best Unlocker Tool",
    backgroundColor: "#05070d",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  window.loadURL(isDev ? appUrl : `${appUrl}/app-login`);
}

app.whenReady().then(() => {
  ipcMain.handle("device:detect", async () => bridge.detectDevice());
  ipcMain.handle("device:plan", async (_event, payload) => bridge.buildSafePlan(payload));
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
