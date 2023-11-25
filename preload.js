const { contextBridge, ipcRenderer, ipcMain } = require('electron');

// allow the bridge between renderer and main process
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive:  (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});
