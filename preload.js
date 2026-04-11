const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // We can add desktop-specific APIs here (like file saving, window controls, etc.)
  platform: process.platform,
});
