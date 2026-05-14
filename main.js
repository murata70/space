const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const Database = require('better-sqlite3');
const fs = require('fs');

let win;
let eaw;
let db;

// 壁紙化モジュール
try {
    eaw = require('electron-as-wallpaper');
} catch (e) {
    console.error("eaw load error:", e);
}

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'project_space.db');

// --- データベース初期化 ---
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
    const row = db.prepare('SELECT id FROM user_settings WHERE id = 1').get();
    if (!row) {
        db.prepare('INSERT INTO user_settings (id, current_theme_id) VALUES (1, "default")').run();
    }
    console.log("DB初期化完了: ", dbPath);
}

// --- ウィンドウ作成 ---
function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        // 壁紙として機能させるための基本設定
        transparent: true,
        frame: false,
        show: false,
        hasShadow: false,
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
        win.show();

        // 開発中のみDevToolsを開く（ビルド後は開かない）
        if (!app.isPackaged) {
            win.webContents.openDevTools();
        }

        // 起動時は必ず操作できるようにマウスイベントを透過させない
        win.setIgnoreMouseEvents(false);

        // 壁紙化の処理（必要に応じて有効化）
        /*
        if (eaw) {
            try { eaw.attach(win); } catch (e) { console.error(e); }
        }
        */
    });

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error(`Failed to load: ${errorCode} - ${errorDescription}`);
    });
}

// --- IPC通信 ---
ipcMain.handle('get-db-data', (event, query, params = []) => {
    try {
        const rows = db.prepare(query).all(params);
        return rows;
    } catch (err) {
        console.error("DB取得エラー:", err);
        throw err;
    }
});

ipcMain.on('save-discovery', (event, itemId) => {
    try {
        db.prepare('INSERT INTO discovery_logs (item_id) VALUES (?)').run(itemId);
    } catch (err) {
        console.error("保存エラー:", err);
    }
});

ipcMain.on('set-ignore-mouse', (event, ignore) => {
    // forward: true をつけることで、背面のデスクトップアイコン等へのクリックを維持しつつ、
    // mousemoveイベントなどをElectron側で検知可能にします
    if (win) win.setIgnoreMouseEvents(ignore, { forward: true });
});

ipcMain.on('quit-app', () => app.quit());

// --- アプリのライフサイクル ---
app.whenReady().then(() => {
    initDatabase();
    createWindow();
});

app.on('will-quit', () => {
    if (db) db.close();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});