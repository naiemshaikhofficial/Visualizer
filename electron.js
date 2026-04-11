const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'public/favicon.ico'),
    autoHideMenuBar: true,
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Handle external links (like Google Auth) in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
