< !DOCTYPE html >
    <html lang="ja">
        <head>
            <meta charset="UTF-8">
                <title>Wallpaper</title>
                <style>
                    body {
                        margin: 0;
                    overflow: hidden;
                    background: url("space-bg.jpg") no-repeat center center / cover;
                    font-family: Arial, sans-serif;
                    color: white;
    }

                    /* 右下UIコンテナ */
                    .bottom-ui {
                        position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(0,0,0,0.4);
                    padding: 10px 15px;
                    border-radius: 12px;
                    backdrop-filter: blur(5px);
    }

                    /* 時計 */
                    #clock {
                        font - size: 18px;
                    letter-spacing: 1px;
    }

                    /* アイコンボタン */
                    .icon-btn {
                        width: 36px;
                    height: 36px;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    transition: 0.2s;
    }

                    .icon-btn:hover {
                        background: rgba(255,255,255,0.4);
                    transform: scale(1.1);
    }
                </style>
        </head>
        <body>

            <!-- 右下UI -->
            <div class="bottom-ui">
                <div id="clock">00:00:00</div>

                <!-- コレクション -->
                <button class="icon-btn" onclick="goCollection()">📁</button>

                <!-- 設定 -->
                <button class="icon-btn" onclick="goSettings()">⚙️</button>
            </div>

            <script>
    // 時計更新
                function updateClock() {
      const now = new Date();
                const h = String(now.getHours()).padStart(2, '0');
                const m = String(now.getMinutes()).padStart(2, '0');
                const s = String(now.getSeconds()).padStart(2, '0');

                document.getElementById("clock").textContent = `${h}:${m}:${s}`;
    }

                setInterval(updateClock, 1000);
                updateClock();

                // 画面遷移
                function goSettings() {
                    window.location.href = "settings.html";
    }

                function goCollection() {
                    window.location.href = "collection.html";
    }
            </script>

        </body>
    </html>