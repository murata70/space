import React from "react";
import { useNavigate } from "react-router-dom"; // navigateを使うために追加推奨
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        // 壁紙画面へ遷移
        navigate("/wallpaper");
    };

    return (
        <>
            {/* 背景レイヤーを追加 */}
            <div className="home-bg"></div>

            <div className="home-container">
                {/* タイトル */}
                <h1 className="home-title">SPACE WALLPAPER</h1>

                {/* 設定BOX */}
                <div className="settings-box">

                    {/* 音量アイコン */}
                    <div className="icon-row">
                        🔊
                    </div>

                    {/* 秒表示切り替え */}
                    <div className="toggle-row">
                        <span>sec</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button>ON</button>
                            <button>OFF</button>
                        </div>
                    </div>

                    {/* 24時間表示切り替え */}
                    <div className="toggle-row">
                        <span>24h</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button>ON</button>
                            <button>OFF</button>
                        </div>
                    </div>

                    {/* タイムゾーン選択 */}
                    <div className="select-row">
                        <select defaultValue="Asia/Tokyo">
                            <option value="Asia/Tokyo">Asia/Tokyo</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">New York</option>
                        </select>
                    </div>

                </div>

                {/* 右下OKボタン */}
                <button className="ok-button" onClick={handleStart}>
                    OK
                </button>
            </div>
        </>
    );
};

export default Home;