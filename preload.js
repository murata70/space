const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', ignore),
    attachWallpaper: () => ipcRenderer.send('attach-wallpaper'),
    updateHitRegions: (regions) => ipcRenderer.send('update-hit-regions', regions),
    startHitTest: () => ipcRenderer.send('start-hit-test'),
    stopHitTest: () => ipcRenderer.send('stop-hit-test'),
    quitApp: () => ipcRenderer.send('quit-app'),
    getDbData: (query, params) => ipcRenderer.invoke('get-db-data', query, params),
    saveDiscovery: (itemId) => ipcRenderer.send('save-discovery', itemId)
});