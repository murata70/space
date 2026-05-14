import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // ホーム画面表示時は、必ずマウス操作を受け付けるように設定
        if (window.electron && window.electron.setIgnoreMouse) {
            window.electron.setIgnoreMouse(false);
        }
    }, []);

    const handleStart = () => {
        // 壁紙画面へ遷移
        navigate("/wallpaper");
    };

    return (
        <>
            {/* 
               背景レイヤー：Home.cssで pointer-events: none; を指定してください。
               これが無いとボタンがクリックできない原因になります。
            */}
            <div className="home-bg"></div>

            <div className="home-container">
                <h1 className="home-title">SPACE WALLPAPER</h1>

                <div className="settings-box">
                    <div className="icon-row">
                        <span role="img" aria-label="volume">🔊</span>
                    </div>

                    <div className="toggle-row">
                        <span>sec</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="toggle-btn">ON</button>
                            <button className="toggle-btn">OFF</button>
                        </div>
                    </div>

                    <div className="toggle-row">
                        <span>24h</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="toggle-btn">ON</button>
                            <button className="toggle-btn">OFF</button>
                        </div>
                    </div>

                    <div className="select-row">
                        <select defaultValue="Asia/Tokyo" className="timezone-select">
                            <option value="Asia/Tokyo">Asia/Tokyo</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">New York</option>
                        </select>
                    </div>
                </div>

                <button className="ok-button" onClick={handleStart}>
                    OK
                </button>
            </div>
        </>
    );
};

export default Home;