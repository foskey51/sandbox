import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      partition: 'persist:default',
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "dist", "index.html");
    win.loadFile(indexPath);
  }

  win.on("ready-to-show", () => {
    win.show();
  });
}

app.whenReady().then(createWindow);
