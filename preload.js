const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // マウス透過の切り替え (true で透過, false で解除)
    setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', ignore),

    // アプリの終了
    quitApp: () => ipcRenderer.send('quit-app'),

    // データベースから情報を取得する (Promiseを返すので async/await で使用可能)
    // 例: window.electron.getDbData('SELECT * FROM user_settings')
    getDbData: (query, params) => ipcRenderer.invoke('get-db-data', query, params),

    // コレクションを保存する
    // 例: window.electron.saveDiscovery('planet_earth')
    saveDiscovery: (itemId) => ipcRenderer.send('save-discovery', itemId)
});