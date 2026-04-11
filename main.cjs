const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// 1. DEFINE PROTOCOL
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('visualizerstudio', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('visualizerstudio');
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "Visualizer Studio",
    icon: path.join(__dirname, 'public/favicon.ico'),
    backgroundColor: '#050505',
    frame: false, // Make it frameless for custom title bar
    webPreferences: {
      nodeIntegration: true, // Enable for desktop features
      contextIsolation: false, // For easier IPC in this build
    },
  });

  // Load from local dist or dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist_web/index.html'));
  }

  // 2. HANDLE EXTERNAL LINKS (Open in System Browser)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 3. HANDLE DEEP LINK EVENTS (For Windows)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      
      // Handle the URL from command line
      const url = commandLine.pop();
      if (url.includes('visualizerstudio://')) {
          mainWindow.webContents.send('auth-callback', url);
      }
    }
  });

  app.whenReady().then(() => {
    createWindow();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
