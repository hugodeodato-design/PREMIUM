const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    backgroundColor: '#f2f4f7',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname,'assets','mrds_icon.ico')
  });

  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({mode:'detach'})
  } else {
    const index = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    if (fs.existsSync(index)) win.loadFile(index);
    else win.loadURL('data:text/html,<h2>Erreur : frontend introuvable</h2>');
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() });
