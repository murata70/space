import React from 'react';
import ReactDOM from 'react-dom/client';

const SpaceApp = () => {
    const murataMessage = "文字表示できました！ - by Murata";

    return (
        <div style={{
            backgroundColor: 'transparent', // 背景を透明にして下の星空を見せる
            color: '#fff',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 中央のタイトル */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
                <h1 style={{ fontSize: '3rem', zIndex: 10 }}>🚀 Space App Ready!</h1>
            </div>

            {/* 【弾幕】この部分が動きます */}
            <div className="danmaku" style={{
                position: 'absolute',
                top: '20%', // 画面の上から20%の位置
                whiteSpace: 'nowrap',
                color: '#00ffcc',
                fontSize: '3rem',
                fontWeight: 'bold',
                textShadow: '0 0 20px rgba(0, 255, 204, 1)',
                zIndex: 999, // 一番手前に表示
                animation: 'danmakuMove 15s linear infinite' // 15秒でループ
            }}>
                {murataMessage}
            </div>

            {/* アニメーションを直接埋め込み */}
            <style>{`
        @keyframes danmakuMove {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-150vw); }
        }
        .danmaku {
          will-change: transform;
        }
      `}</style>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <SpaceApp />
    </React.StrictMode>
);