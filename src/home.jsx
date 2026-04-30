import React from "react";

const Home = () => {
    const handleStart = () => {
        // 画面遷移（シンプル版）
        window.location.href = "/wallpaper";

        // React Router使う場合は↓に差し替え
        // navigate("/wallpaper");
    };

    return (
        <div style={styles.container}>
            {/* メインUI */}
            <div style={styles.content}>

                {/* タイトル的なもの（任意） */}
                <div style={styles.title}>
                    SPACE WALLPAPER
                </div>

                {/* 設定っぽいUI（仮） */}
                <div style={styles.settingsBox}>

                    {/* 音量（アイコン想定） */}
                    <div style={styles.iconRow}>
                        🔊
                    </div>

                    {/* 秒表示ON/OFF */}
                    <div style={styles.toggleRow}>
                        <span>sec</span>
                        <button>ON</button>
                        <button>OFF</button>
                    </div>

                    {/* 24h / 12h */}
                    <div style={styles.toggleRow}>
                        <span>24h</span>
                        <button>ON</button>
                        <button>OFF</button>
                    </div>

                    {/* タイムゾーン */}
                    <div style={styles.selectRow}>
                        <select>
                            <option value="Asia/Tokyo">Asia/Tokyo</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">New York</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* 右下OKボタン */}
            <button style={styles.okButton} onClick={handleStart}>
                OK
            </button>
        </div>
    );
};

export default Home;

/* スタイル */
const styles = {
    container: {
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0b0f1a",
        color: "#fff",
        position: "relative",
        fontFamily: "sans-serif",
    },

    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },

    title: {
        fontSize: "24px",
        marginBottom: "30px",
        letterSpacing: "2px",
    },

    settingsBox: {
        background: "rgba(255,255,255,0.05)",
        padding: "20px",
        borderRadius: "10px",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },

    iconRow: {
        fontSize: "24px",
        textAlign: "center",
    },

    toggleRow: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "space-between",
    },

    selectRow: {
        display: "flex",
        justifyContent: "center",
    },

    okButton: {
        position: "absolute",
        bottom: "20px",
        right: "20px",
        padding: "12px 24px",
        fontSize: "16px",
        backgroundColor: "#4cafef",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        cursor: "pointer",
    },
};