// 1. 必要なライブラリのインポート
const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
// 壁紙化ライブラリ
const eaw = require('electron-as-wallpaper');

let win;

// 2. ウィンドウを作成する関数
function createWindow() {
    // メインディスプレイのサイズを取得
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    win = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        transparent: false,         // ★テストのため、一旦 false (透明にしない) にします
        frame: true,                // ★テストのため、一旦 true (枠あり) にします
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // 3. 表示する画面を読み込む
    win.loadFile(path.join(__dirname, 'public/index.html'));

    // ★検証ツール（右側の英語の画面）を自動で開く
    win.webContents.openDevTools();

    // ★ 4. 壁紙への貼り付け（テスト中は一旦コメントアウトして無効化します）
    /*
    try {
        eaw.attach(win);
    } catch (err) {
        console.error("壁紙への貼り付けに失敗しました:", err);
    }
    */

    win.on('closed', () => {
        win = null;
    });
}

// 5. アプリの準備ができたらウィンドウを表示する
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 6. すべてのウィンドウが閉じられたらアプリを終了する
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});