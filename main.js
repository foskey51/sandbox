import { app, BrowserWindow } from "electron"

function createWindow() {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,  // Keep secure
            contextIsolation: true,  // Keep secure
            webSecurity: false,  // Disable: Allows HTTP iframes, CORS bypass, no same-origin blocks
            allowRunningInsecureContent: true,
            webviewTag: true,  // Enable <webview> tag
            webSecurity: false,  
        }
    })

win.loadURL('http://localhost:5173')
//win.webContents.openDevTools();  // For debugging
}

app.whenReady().then(createWindow)