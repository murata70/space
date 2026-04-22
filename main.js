// 1. 必要なライブラリのインポート
const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
// 壁紙化ライブラリ（事前に npm install electron-as-wallpaper が必要です）
const eaw = require('electron-as-wallpaper');

let win;

// 2. ウィンドウを作成する関数
function createWindow() {
    // メインディスプレイのサイズを取得（マルチディスプレイ対策）
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    win = new BrowserWindow({
        width: width,              // 画面いっぱいの幅
        height: height,            // 画面いっぱいの高さ
        x: 0,
        y: 0,
        transparent: true,         // 背景を透明にする
        frame: false,               // 枠や閉じるボタンを消す
        type: 'desktop',           // Linuxなど一部OSで壁紙として扱うための設定
        enableLargerThanScreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js') // 必要に応じて使用
        }
    });

    // 3. 表示する画面を読み込む
    // 開発中（Reactを起動している時）はこちら
    win.loadURL('http://localhost:3000');

    // もしindex.htmlを直接読み込む場合はこちらを使ってください
    // win.loadFile(path.join(__dirname, 'public/index.html'));

    // ★ 4. デスクトップの壁紙に貼り付ける（ここが心臓部！）
    try {
        eaw.attach(win);
    } catch (err) {
        console.error("壁紙への貼り付けに失敗しました:", err);
    }

    // ウィンドウが閉じられた時の処理
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