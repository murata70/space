const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getDisplayLayout: () => ipcRenderer.invoke('get-display-layout'),
    getCursorClientPoint: () => ipcRenderer.invoke('get-cursor-client-point'),
    onDisplayLayoutChanged: (callback) => {
        const handler = (_event, layout) => callback(layout);
        ipcRenderer.on('display-layout-changed', handler);
        return () => ipcRenderer.removeListener('display-layout-changed', handler);
    },
    setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', ignore),
    attachWallpaper: () => ipcRenderer.send('attach-wallpaper'),
    detachWallpaper: () => ipcRenderer.send('detach-wallpaper'),
    beginRocketInteraction: () => ipcRenderer.send('begin-rocket-interaction'),
    endRocketInteraction: () => ipcRenderer.send('end-rocket-interaction'),
    updateHitRegions: (regions) => ipcRenderer.send('update-hit-regions', regions),
    startHitTest: () => ipcRenderer.send('start-hit-test'),
    stopHitTest: () => ipcRenderer.send('stop-hit-test'),
    quitApp: () => ipcRenderer.send('quit-app'),
    getDbData: (query, params) => ipcRenderer.invoke('get-db-data', query, params),
    saveDiscovery: (itemId) => ipcRenderer.send('save-discovery', itemId)
});