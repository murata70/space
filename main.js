const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let win;
let eaw;
let db; // DBインスタンスをグローバルで保持

try { eaw = require('electron-as-wallpaper'); } catch (e) { console.error(e); }

const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'project_space.db');

// --- データベース初期化 ---
function initDatabase() {
    return new Promise((resolve, reject) => {
        // フォルダがない場合は作成
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }

        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('DB接続エラー:', err);
                return reject(err);
            }

            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS user_settings (
                    id INTEGER PRIMARY KEY DEFAULT 1,
                    current_theme_id TEXT,
                    volume_level INTEGER DEFAULT 50,
                    show_seconds INTEGER DEFAULT 1,
                    time_format_24h INTEGER DEFAULT 1,
                    timezone TEXT DEFAULT 'Asia/Tokyo',
                    rocket_color_idx INTEGER DEFAULT 0
                )`);

                db.run(`CREATE TABLE IF NOT EXISTS discovery_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id TEXT,
                    discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`);

                db.get('SELECT id FROM user_settings WHERE id = 1', (err, row) => {
                    if (!row) {
                        db.run('INSERT INTO user_settings (id, current_theme_id) VALUES (1, "default")');
                    }
                });

                console.log("DB初期化完了: ", dbPath);
                resolve();
            });
        });
    });
}

// --- ウィンドウ作成 ---
function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().size;
    win = new BrowserWindow({
        width, height, x: 0, y: 0,
        transparent: true, frame: false, hasShadow: false,
        skipTaskbar: true, show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const startUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, 'build/index.html')}`;

    win.loadURL(startUrl);
    win.once('ready-to-show', () => {
        win.show();
        if (eaw) {
            try { eaw.attach(win); } catch (e) { console.error(e); }
        }
        win.setIgnoreMouseEvents(true, { forward: true });
    });
}

// --- IPC通信 (既存のdbを使い回す) ---
ipcMain.handle('get-db-data', (event, query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.on('save-discovery', (event, itemId) => {
    db.run('INSERT INTO discovery_logs (item_id) VALUES (?)', [itemId], (err) => {
        if (err) console.error("保存エラー:", err);
    });
});

ipcMain.on('set-ignore-mouse', (event, ignore) => {
    if (win) win.setIgnoreMouseEvents(ignore, { forward: true });
});

ipcMain.on('quit-app', () => app.quit());

// --- アプリのライフサイクル ---
app.whenReady().then(async () => {
    await initDatabase();
    createWindow();
});

// アプリ終了時にDBを閉じる
app.on('will-quit', () => {
    if (db) db.close();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});