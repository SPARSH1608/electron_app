const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true, 
    kiosk: true, 
    resizable: false, 
    minimizable: false, 
    maximizable: false,
    frame: false, 
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");


  ipcMain.on("close-app", () => {
    app.quit();
  });

  app.on("window-all-closed", () => {
    app.quit();
  });
});
