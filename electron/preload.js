const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, args) => ipcRenderer.invoke(channel, args),
  send: (channel, args) => ipcRenderer.send(channel, args),
  on: (channel, cb) => ipcRenderer.on(channel, cb)
});
