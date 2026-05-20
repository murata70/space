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

const HOME_WINDOW = { width: 1000, height: 700 };
const WALLPAPER_ROUTES = new Set(['/wallpaper', '/wallpaper_ocean']);
const APP_WINDOW_ROUTES = new Set([
    '/',
    '/settings',
    '/collection',
    '/settings_ocean',
    '/collection_ocean',
]);

function getVirtualDesktopBounds() {
    const displays = screen.getAllDisplays();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    displays.forEach((display) => {
        const { x, y, width, height } = display.bounds;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
    });

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

function getPrimaryDisplayLayout() {
    const virtual = getVirtualDesktopBounds();
    const primary = screen.getPrimaryDisplay().bounds;

    return {
        virtual,
        primary: {
            x: primary.x,
            y: primary.y,
            width: primary.width,
            height: primary.height,
            offsetX: primary.x - virtual.x,
            offsetY: primary.y - virtual.y,
        },
    };
}

function broadcastDisplayLayout() {
    if (!win?.webContents) return;
    win.webContents.send('display-layout-changed', getPrimaryDisplayLayout());
}

function centerWindowOnPrimary(width, height) {
    const primary = screen.getPrimaryDisplay().bounds;
    return {
        x: Math.round(primary.x + (primary.width - width) / 2),
        y: Math.round(primary.y + (primary.height - height) / 2),
        width,
        height,
    };
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
    win.setBounds(centerWindowOnPrimary(HOME_WINDOW.width, HOME_WINDOW.height));
    win.show();
    win.focus();
    broadcastDisplayLayout();
}

function attachAsWallpaper() {
    if (!eaw || !win) {
        console.warn('壁紙化モジュール、またはウィンドウが有効ではありません。');
        return false;
    }

    try {
        const virtual = getVirtualDesktopBounds();
        win.setResizable(true);
        win.setBounds(virtual);
        win.setSkipTaskbar(true);
        eaw.attach(win, {
            transparent: true,
            forwardMouseInput: true,
            forwardKeyboardInput: false,
        });
        win.setOpacity(1.0);
        win.show();
        wallpaperMousePassthrough = true;
        applyMousePassthrough(true);
        broadcastDisplayLayout();
        return true;
    } catch (err) {
        console.error('壁紙化失敗:', err);
        return false;
    }
}

function syncWindowModeFromRoute() {
    if (!win) return;

    const route = getHashRoute();

    if (WALLPAPER_ROUTES.has(route)) {
        if (!win.wallpaperState?.isAttached) {
            attachAsWallpaper();
        } else {
            const virtual = getVirtualDesktopBounds();
            win.setBounds(virtual);
            broadcastDisplayLayout();
        }
        return;
    }

    if (APP_WINDOW_ROUTES.has(route)) {
        ensureNormalAppWindow();
    }
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

    win.webContents.on('did-finish-load', () => syncWindowModeFromRoute());
    win.webContents.on('did-navigate-in-page', () => syncWindowModeFromRoute());

    const forceShowTimeout = setTimeout(() => {
        if (win && !win.isVisible()) {
            console.warn('ready-to-show が発火しなかったため、強制表示します。');
            win.setBounds(centerWindowOnPrimary(HOME_WINDOW.width, HOME_WINDOW.height));
            win.show();
        }
    }, 1500);

    win.once('ready-to-show', () => {
        clearTimeout(forceShowTimeout);
        win.setBounds(centerWindowOnPrimary(HOME_WINDOW.width, HOME_WINDOW.height));
        win.show();
        syncWindowModeFromRoute();
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
    attachAsWallpaper();
});

ipcMain.handle('get-display-layout', () => getPrimaryDisplayLayout());

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

    screen.on('display-metrics-changed', () => {
        if (!win) return;
        if (win.wallpaperState?.isAttached) {
            win.setBounds(getVirtualDesktopBounds());
        }
        broadcastDisplayLayout();
        syncWindowModeFromRoute();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});