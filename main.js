const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const Database = require('better-sqlite3');
const fs = require('fs');

let win;
let eaw;
let db;

try {
    eaw = require('electron-as-wallpaper');
} catch (e) {
    console.error("eaw load error:", e);
}

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'project_space.db');

function initDatabase() {
    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
    }
    db = new Database(dbPath);
    db.exec(`CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        current_theme_id TEXT,
        volume_level INTEGER DEFAULT 50,
        show_seconds INTEGER DEFAULT 1,
        time_format_24h INTEGER DEFAULT 1,
        timezone TEXT DEFAULT 'Asia/Tokyo',
        rocket_color_idx INTEGER DEFAULT 0
    )`);
    db.exec(`CREATE TABLE IF NOT EXISTS discovery_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id TEXT,
        discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        transparent: true,
        frame: false,
        show: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const startUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : url.format({
            pathname: path.join(__dirname, 'build/index.html'),
            protocol: 'file:',
            slashes: true
        });

    win.loadURL(startUrl);

    win.once('ready-to-show', () => {
        win.center();
        win.show();
    });
}

// --- IPC通信 ---

ipcMain.on('attach-wallpaper', () => {
    if (eaw && win) {
        try {
            const { width, height } = screen.getPrimaryDisplay().bounds;
            win.setResizable(true);
            win.setBounds({ x: 0, y: 0, width, height });
            eaw.attach(win);
            win.focus();
            win.setOpacity(1.0);
            win.show();
        } catch (e) {
            console.error("壁紙化失敗:", e);
        }
    }
});

// ★修正ポイント：マウス透過の制御
ipcMain.on('set-ignore-mouse', (event, ignore) => {
    if (win) {
        if (ignore) {
            // forward: true を指定することで、
            // 「HTML上の透明な部分はスルーし、不透明な部分（ボタン等）だけ反応する」ようになります
            win.setIgnoreMouseEvents(true, { forward: true });
        } else {
            win.setIgnoreMouseEvents(false);
        }
    }
});

ipcMain.handle('get-db-data', (event, query, params = []) => {
    return db.prepare(query).all(params);
});

ipcMain.on('save-discovery', (event, itemId) => {
    db.prepare('INSERT INTO discovery_logs (item_id) VALUES (?)').run(itemId);
});

ipcMain.on('quit-app', () => app.quit());

app.whenReady().then(() => {
    initDatabase();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});