const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;
let eaw;
let db = null;
let wallpaperMousePassthrough = true;

// better-sqlite3 の読み込みと変数代入を完全に安全化
try {
    const Database = require('better-sqlite3');
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'project_space.db');

    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
    }
    db = new Database(dbPath);
} catch (e) {
    console.error("Database (better-sqlite3) load error:", e);
}

// 壁紙モジュールの読み込み安全化
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
/** 壁紙を張ったままにするルート（設定・コレクション含む） */
const WALLPAPER_ATTACHED_ROUTES = new Set([
    '/wallpaper',
    '/wallpaper_ocean',
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

function boundsEqual(a, b) {
    return (
        a &&
        b &&
        a.x === b.x &&
        a.y === b.y &&
        a.width === b.width &&
        a.height === b.height
    );
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

function applyMousePassthrough(ignore) {
    if (!win || win.isDestroyed()) return;
    try {
        // forward: true にすることで、レンダラー(React)にマウスイベントを流しつつ透過させる
        win.setIgnoreMouseEvents(ignore, { forward: true });
    } catch (e) {
        // 特定環境でのチラつきやエラーをキャッチ
        console.error("setIgnoreMouseEvents error:", e);
    }
}

function ensureNormalAppWindow() {
    if (!win) return;

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

function getHashRoute() {
    if (!win) return '/';
    const currentUrl = win.webContents.getURL();
    const hashIdx = currentUrl.indexOf('#');
    if (hashIdx === -1) return '/';
    let route = currentUrl.slice(hashIdx + 1);
    if (route.includes('?')) {
        route = route.split('?')[0];
    }
    return route;
}

function syncWindowModeFromRoute() {
    if (!win) return;

    const route = getHashRoute();

    if (WALLPAPER_ATTACHED_ROUTES.has(route)) {
        if (!win.wallpaperState?.isAttached) {
            attachAsWallpaper();
        } else {
            const virtual = getVirtualDesktopBounds();
            const current = win.getBounds();
            if (!boundsEqual(current, virtual)) {
                win.setBounds(virtual);
            }
            wallpaperMousePassthrough = true;
            applyMousePassthrough(true);
            broadcastDisplayLayout();
        }
        return;
    }

    if (route === '/') {
        ensureNormalAppWindow();
    }
}

function initDatabase() {
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
    initDatabase();

    win = new BrowserWindow({
        width: 1000,
        height: 700,
        transparent: true,
        backgroundColor: '#050816',
        frame: false,
        show: false,
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

    win.once('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        win = null;
    });
}

// IPC 通信のハンドリング（React からの透過ON/OFF要求を処理）
ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
    wallpaperMousePassthrough = ignore;
    applyMousePassthrough(ignore);
});

ipcMain.handle('get-display-layout', () => {
    return getPrimaryDisplayLayout();
});

ipcMain.handle('get-cursor-client-point', () => {
    if (!win) return { x: null, y: null, inWindow: false };
    const cursorPoint = screen.getCursorScreenPoint();
    const winBounds = win.getBounds();

    const x = cursorPoint.x - winBounds.x;
    const y = cursorPoint.y - winBounds.y;

    const inWindow = (
        cursorPoint.x >= winBounds.x &&
        cursorPoint.x < winBounds.x + winBounds.width &&
        cursorPoint.y >= winBounds.y &&
        cursorPoint.y < winBounds.y + winBounds.height
    );

    return { x, y, inWindow };
});

// アプリケーションのライフサイクル
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});