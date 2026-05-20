const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;
let eaw;
let db = null; // 初期値を明示的にnullに設定

// 【修正】better-sqlite3 の読み込みと変数代入を完全に安全化
try {
    const Database = require('better-sqlite3');
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'project_space.db');

    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
    }
    db = new Database(dbPath);
} catch (e) {
    // クラッシュログを出力しつつ、アプリの起動は邪魔しない
    console.error("Database (better-sqlite3) load error:", e);
}

// 【修正】壁紙モジュールの読み込み安全化
try {
    eaw = require('electron-as-wallpaper');
} catch (e) {
    console.error("eaw load error:", e);
}

function initDatabase() {
    // db が正常に初期化されていない場合はログを出して安全にスキップ
    if (!db) {
        console.warn("Database が初期化されていないため、テーブル作成をスキップします。");
        return;
    }
    try {
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
    } catch (e) {
        console.error("Table creation error:", e);
    }
}

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        transparent: true,
        frame: false,
        show: false, // ready-to-show で表示
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

    // Reactのポートが3000番であることを想定
    const startUrl = isDev
        ? 'http://localhost:3000'
        : url.format({
            pathname: path.join(__dirname, 'build', 'index.html'),
            protocol: 'file:',
            slashes: true
        });

    win.loadURL(startUrl);

    // 【修正】万が一React側が応答しなくても、1.5秒後に強制的にウィンドウを表示させる安全タイマー
    const forceShowTimeout = setTimeout(() => {
        if (win && !win.isVisible()) {
            console.warn("ready-to-show が発火しなかったため、強制表示します。");
            win.center();
            win.show();
        }
    }, 1500);

    win.once('ready-to-show', () => {
        clearTimeout(forceShowTimeout);
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
    } else {
        console.warn("壁紙化モジュール、またはウィンドウが有効ではありません。");
    }
});

ipcMain.on('set-ignore-mouse', (event, ignore) => {
    if (win) {
        if (ignore) {
            win.setIgnoreMouseEvents(true, { forward: true });
        } else {
            win.setIgnoreMouseEvents(false);
        }
    }
});

ipcMain.handle('get-db-data', (event, query, params = []) => {
    if (!db) return [];
    try {
        return db.prepare(query).all(params);
    } catch (e) {
        console.error("get-db-data error:", e);
        return [];
    }
});

ipcMain.on('save-discovery', (event, itemId) => {
    if (!db) return;
    try {
        db.prepare('INSERT INTO discovery_logs (item_id) VALUES (?)').run(itemId);
    } catch (e) {
        console.error("save-discovery error:", e);
    }
});

ipcMain.on('quit-app', () => app.quit());

app.whenReady().then(() => {
    initDatabase();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});