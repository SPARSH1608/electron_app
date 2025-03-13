const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

// Add this near the top of your file
let mainWindow;

// Add this before createWindow function
ipcMain.on('close-app', () => {
  app.quit();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    kiosk: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Block navigation to external sites
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentURL = mainWindow.webContents.getURL();
    const baseURL = 'file://' + __dirname;
    
    if (!url.startsWith(baseURL)) {
      event.preventDefault();
    }
  });

  // Block new window creation
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Disable Alt+Tab, Win key, Alt+F4, etc.
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Block Alt+Tab, Windows key and other system keys
    if (input.key === 'Tab' && input.alt ||
        input.key === 'F4' && input.alt ||
        input.key === 'Meta') {
      event.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Register global shortcuts to prevent Alt+Tab, etc.
  globalShortcut.register('Alt+Tab', () => {
    return false;
  });
  
  globalShortcut.register('Super', () => {
    return false;
  });
  
  globalShortcut.register('CommandOrControl+Tab', () => {
    return false;
  });
  
  globalShortcut.register('Alt+F4', () => {
    return false;
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') app.quit();
});