const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;
let eaw;
let db = null; // 初期値を明示的にnullに設定
let normalizedHitRegions = [];
let hitTestTimer = null;
let wallpaperMousePassthrough = true;

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

function getBuildIndexUrl() {
    const buildIndex = path.join(__dirname, 'build', 'index.html');
    if (!fs.existsSync(buildIndex)) return null;
    return url.format({
        pathname: buildIndex,
        protocol: 'file:',
        slashes: true,
    });
}

/** npm start 併用時のみ ELECTRON_DEV=1 で localhost:3000 を使う */
function resolveStartUrl() {
    const buildUrl = getBuildIndexUrl();
    const useDevServer =
        !app.isPackaged && process.env.ELECTRON_DEV === '1';

    if (app.isPackaged) {
        return buildUrl;
    }
    if (useDevServer) {
        return 'http://localhost:3000';
    }
    if (buildUrl) {
        return `${buildUrl}#/`;
    }
    console.warn(
        'build/index.html がありません。npm run build を実行してください。'
    );
    return 'http://localhost:3000';
}

function ensureNormalAppWindow() {
    if (!win) return;

    stopHitTest();
    applyMousePassthrough(false);

    if (eaw && win.wallpaperState?.isAttached) {
        try {
            eaw.detach(win);
        } catch (e) {
            console.error('壁紙解除失敗:', e);
        }
    }

    win.setSkipTaskbar?.(false);
    win.setAlwaysOnTop(false);
    win.setResizable(false);
    win.setBounds({ width: 1000, height: 700 });
    win.center();
    win.show();
    win.focus();
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
        backgroundColor: '#050816',
        frame: false,
        show: false, // ready-to-show で表示
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const startUrl = resolveStartUrl();
    let loadFallbackAttempted = false;

    win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
        if (loadFallbackAttempted) return;
        const fallback = getBuildIndexUrl();
        if (
            fallback &&
            validatedURL &&
            validatedURL.startsWith('http://localhost')
        ) {
            loadFallbackAttempted = true;
            console.warn(
                `開発サーバー接続失敗 (${errorDescription}, code=${errorCode})。build を読み込みます。`
            );
            win.loadURL(`${fallback}#/`);
        }
    });

    win.loadURL(startUrl);

    win.webContents.on('did-finish-load', () => {
        const route = getHashRoute();
        if (route === '/' || route === '') {
            ensureNormalAppWindow();
        }
    });

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

function applyMousePassthrough(ignore) {
    if (!win) return;
    if (ignore) {
        win.setIgnoreMouseEvents(true, { forward: true });
    } else {
        win.setIgnoreMouseEvents(false);
    }
}

function isCursorOverHitRegions() {
    if (!win || normalizedHitRegions.length === 0) return false;

    const point = screen.getCursorScreenPoint();
    const bounds = win.getContentBounds();
    if (bounds.width <= 0 || bounds.height <= 0) return false;

    const relX = (point.x - bounds.x) / bounds.width;
    const relY = (point.y - bounds.y) / bounds.height;

    if (relX < 0 || relX > 1 || relY < 0 || relY > 1) {
        return false;
    }

    return normalizedHitRegions.some(
        (r) =>
            relX >= r.left &&
            relX <= r.right &&
            relY >= r.top &&
            relY <= r.bottom
    );
}

function runHitTestTick() {
    if (!win || !wallpaperMousePassthrough) return;
    const interactive = isCursorOverHitRegions();
    applyMousePassthrough(!interactive);
}

function startHitTest() {
    if (hitTestTimer) return;
    wallpaperMousePassthrough = true;
    hitTestTimer = setInterval(runHitTestTick, 32);
    runHitTestTick();
}

function stopHitTest() {
    if (hitTestTimer) {
        clearInterval(hitTestTimer);
        hitTestTimer = null;
    }
    normalizedHitRegions = [];
    wallpaperMousePassthrough = false;
    applyMousePassthrough(false);
}

function getHashRoute() {
    if (!win?.webContents) return '/';
    try {
        const hash = new URL(win.webContents.getURL()).hash || '#/';
        let route = decodeURIComponent(hash.slice(1)) || '/';
        if (!route.startsWith('/')) {
            route = `/${route}`;
        }
        const trimmed = route.replace(/\/+$/, '');
        return trimmed || '/';
    } catch {
        return '/';
    }
}

// --- IPC通信 ---
ipcMain.on('detach-wallpaper', () => {
    ensureNormalAppWindow();
});

ipcMain.on('begin-rocket-interaction', () => {
    applyMousePassthrough(false);
});

ipcMain.on('end-rocket-interaction', () => {
    if (wallpaperMousePassthrough) {
        applyMousePassthrough(true);
    }
});

ipcMain.on('attach-wallpaper', () => {
    if (eaw && win) {
        try {
            const { bounds } = screen.getPrimaryDisplay();
            win.setResizable(true);
            win.setBounds({
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height,
            });
            eaw.attach(win, {
                transparent: true,
                forwardMouseInput: true,
                forwardKeyboardInput: false,
            });
            win.setOpacity(1.0);
            win.show();
            wallpaperMousePassthrough = true;
            applyMousePassthrough(true);
        } catch (e) {
            console.error("壁紙化失敗:", e);
        }
    } else {
        console.warn("壁紙化モジュール、またはウィンドウが有効ではありません。");
    }
});

ipcMain.on('update-hit-regions', (event, regions) => {
    normalizedHitRegions = Array.isArray(regions) ? regions : [];
    runHitTestTick();
});

ipcMain.on('start-hit-test', () => {
    startHitTest();
});

ipcMain.on('stop-hit-test', () => {
    stopHitTest();
});

ipcMain.on('set-ignore-mouse', (_event, ignore) => {
    if (!wallpaperMousePassthrough) {
        applyMousePassthrough(ignore);
        return;
    }
    applyMousePassthrough(ignore);
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