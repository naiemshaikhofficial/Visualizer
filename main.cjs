const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Visualizer Studio",
    icon: path.join(__dirname, 'public/favicon.ico'),
    backgroundColor: '#050505',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true
  });

  // Load from local dist or dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5000');
  } else {
    win.loadFile(path.join(__dirname, 'dist_web/index.html'));
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
