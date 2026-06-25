const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;
let eaw;
let db = null;
let wallpaperMousePassthrough = true;

// better-sqlite3 の読み込みと変数代入を完全に安全化 修正中
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

/** build 未作成時に黒画面にならないよう案内ページを表示 */
function getStartupErrorPage(message) {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"/>
<style>
  body{margin:0;padding:32px;font-family:Segoe UI,sans-serif;background:#050816;color:#dff4ff;}
  h1{font-size:22px;letter-spacing:2px;}
  p{line-height:1.6;color:#9eb8d8;}
  code{background:rgba(255,255,255,.08);padding:2px 8px;border-radius:4px;}
</style></head>
<body>
  <h1>PROJECT space</h1>
  <p>${message}</p>
  <p>ターミナルで <code>npm run build</code> のあと <code>npm run electron</code> を実行してください。<br>
  または <code>npm run electron:start</code>（ビルド込み）を使ってください。</p>
</body></html>`;
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

/** npm start 併用時のみ ELECTRON_DEV=1 で localhost:3000 を使う */
function resolveStartUrl() {
    const buildUrl = getBuildIndexUrl();
    const useDevServer =
        !app.isPackaged && process.env.ELECTRON_DEV === '1';

    if (app.isPackaged) {
        if (!buildUrl) {
            return getStartupErrorPage('build/index.html が見つかりません。');
        }
        return `${buildUrl}#/`;
    }
    if (useDevServer) {
        return 'http://localhost:3000';
    }
    if (buildUrl) {
        return `${buildUrl}#/`;
    }
    console.error(
        'build/index.html がありません。npm run build を実行してください。'
    );
    return getStartupErrorPage(
        'build フォルダがありません。React 画面を読み込めません。'
    );
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
    // "#" のみや空文字はホーム扱い（HashRouter の "/" と揃える）
    if (!route || route === '/') return '/';
    if (!route.startsWith('/')) route = `/${route}`;
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
        if (!validatedURL?.startsWith('http://localhost')) return;

        loadFallbackAttempted = true;
        if (fallback) {
            console.warn(
                `開発サーバー接続失敗 (${errorDescription}, code=${errorCode})。build を読み込みます。`
            );
            win.loadURL(`${fallback}#/`);
            return;
        }
        console.error(
            `開発サーバー接続失敗 (${errorDescription}, code=${errorCode})。build もありません。`
        );
        win.loadURL(
            getStartupErrorPage(
                '開発サーバー (localhost:3000) に接続できず、build も見つかりません。'
            )
        );
    });

    win.loadURL(startUrl);

    win.webContents.on('did-finish-load', () => syncWindowModeFromRoute());
    win.webContents.on('did-navigate-in-page', () => syncWindowModeFromRoute());

    const forceShowTimeout = setTimeout(() => {
        if (win && !win.isVisible()) {
            console.warn('ready-to-show が発火しなかったため、強制表示します。');
            ensureNormalAppWindow();
        }
    }, 1500);

    win.once('ready-to-show', () => {
        clearTimeout(forceShowTimeout);
        syncWindowModeFromRoute();
    });

    win.on('closed', () => {
        win = null;
    });
}

function getLaunchPrefPath() {
    return path.join(app.getPath('userData'), 'launch-on-startup.json');
}

function readLaunchPrefFromDisk() {
    try {
        const data = JSON.parse(fs.readFileSync(getLaunchPrefPath(), 'utf8'));
        if (typeof data.enabled === 'boolean') return data.enabled;
    } catch (e) {
        // 初回起動時は未作成
    }
    return true;
}

function writeLaunchPrefToDisk(enabled) {
    const userDataPath = app.getPath('userData');
    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
    }
    fs.writeFileSync(
        getLaunchPrefPath(),
        JSON.stringify({ enabled: Boolean(enabled) }),
        'utf8'
    );
}

function applyLaunchOnStartup(enabled) {
    const value = Boolean(enabled);
    writeLaunchPrefToDisk(value);

    if (!app.isPackaged) {
        return { enabled: value, applied: false };
    }

    app.setLoginItemSettings({
        openAtLogin: value,
        path: process.execPath,
        args: [],
    });

    return { enabled: value, applied: true };
}

// IPC 通信のハンドリング（React からの透過ON/OFF要求を処理）
ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
    wallpaperMousePassthrough = ignore;
    applyMousePassthrough(ignore);
});

ipcMain.on('attach-wallpaper', () => {
    syncWindowModeFromRoute();
});

ipcMain.on('refresh-display-layout', () => {
    broadcastDisplayLayout();
});

ipcMain.on('quit-app', () => {
    app.quit();
});

ipcMain.handle('get-launch-on-startup', () => {
    if (app.isPackaged) {
        return app.getLoginItemSettings().openAtLogin;
    }
    return readLaunchPrefFromDisk();
});

ipcMain.handle('set-launch-on-startup', (_event, enabled) => {
    return applyLaunchOnStartup(enabled);
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
    applyLaunchOnStartup(readLaunchPrefFromDisk());
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});