import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (window.electron && window.electron.setIgnoreMouse) {
            window.electron.setIgnoreMouse(false); // 初期状態は操作可能
        }
    }, []);

    const handleStart = () => {
        navigate("/wallpaper");

        setTimeout(() => {
            if (window.electron && window.electron.attachWallpaper) {
                window.electron.attachWallpaper();
            }
            if (window.electron && window.electron.setIgnoreMouse) {
                // 第二引数に { forward: true } をメインプロセスで処理させることで
                // 「透明な部分は透過し、クリック要素（ボタン）は反応する」設定にします
                window.electron.setIgnoreMouse(true);
            }
        }, 300);
    };

    return (
        <div className="home-wrapper">
            <div className="home-bg"></div>
            <div className="home-container">
                <h1 className="home-title">SPACE WALLPAPER</h1>
                <div className="settings-box">
                    <div className="icon-row"><span role="img" aria-label="volume">🔊</span></div>
                    <div className="toggle-row">
                        <span>sec</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="toggle-btn">ON</button>
                            <button className="toggle-btn">OFF</button>
                        </div>
                    </div>
                </div>
                <button className="ok-button" onClick={handleStart}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default Home;