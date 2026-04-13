// 1. 必要なライブラリのインポート (Javaの import に相当)
const { app, BrowserWindow } = require('electron');

// 2. ウィンドウを作成する関数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,        // ウィンドウの幅
    height: 600,       // ウィンドウの高さ
    webPreferences: {
      nodeIntegration: true,    // JavaScriptからシステムを操作できるようにする
      contextIsolation: false
    }
  });

  // 3. 表示する画面ファイル (index.html) を読み込む
  win.loadFile('index.html');
}

// 4. アプリの準備ができたらウィンドウを表示する
app.whenReady().then(createWindow);

// 5. すべてのウィンドウが閉じられたらアプリを終了する (Mac以外のOS用)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});