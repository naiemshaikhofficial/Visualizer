const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Visualizer Studio Pro",
    icon: path.join(__dirname, 'public/favicon.ico'),
    backgroundColor: '#050505',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Hide the default menu bar for a cleaner "Studio" look
    autoHideMenuBar: true
  });

  // During development, load from Vite's dev server
  // Once built, it will load the index.html from dist
  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, 'dist_web/index.html')}`;

  win.loadURL(startUrl);

  // Optional: Open DevTools while developing
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
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
