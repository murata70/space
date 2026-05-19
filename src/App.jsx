import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home';
import Wallpaper from './pages/Wallpaper/Wallpaper';
import WallpaperOcean from './pages/Wallpaper/Wallpaper_ocean';
import Settings from './pages/Settings/Settings';
import Collection from './pages/Collection/Collection';

// テーマに合わせた背景色の完全分離制御
function ThemeColorController() {
    useEffect(() => {
        const updateThemeColor = () => {
            const hash = window.location.hash;
            const rootElement = document.getElementById('root');
            if (!rootElement) return;

            // 宇宙と海で完全に別のカラーを適用（共通化不可の独立設計）
            if (hash.includes('ocean') || hash.includes('settings?theme=ocean')) {
                // 海テーマ：深海をイメージしたディープブルー
                rootElement.style.backgroundColor = '#021126';
                document.body.style.backgroundColor = '#021126';
            } else {
                // 宇宙テーマ：これまでの宇宙のベース黒
                rootElement.style.backgroundColor = '#050816';
                document.body.style.backgroundColor = '#050816';
            }
        };

        // 初期ロード時とハッシュ変更時に色を更新
        updateThemeColor();
        window.addEventListener('hashchange', updateThemeColor);
        return () => window.removeEventListener('hashchange', updateThemeColor);
    }, []);

    return null;
}

function App() {
    // 開発環境(localhost)と本番環境(file://)の双方で有効な、先頭に「/」がつかない純粋な相対パスの起点を作成
    const isDev = window.location.hostname === "localhost";
    const relativeUrl = isDev ? "" : window.location.origin + window.location.pathname.replace("index.html", "");

    return (
        <Router>
            <ThemeColorController />
            <Routes>
                {/* 
                  各ページコンポーネント側では、受け取った `baseUrl` を使い、
                  src={`${baseUrl}assets/ocean_image/...`} のように
                  先頭の「/」を排除して結合することで、画像が正常に表示されるようになります。
                */}
                <Route path="/" element={<Home baseUrl={relativeUrl} />} />
                <Route path="/wallpaper" element={<Wallpaper baseUrl={relativeUrl} />} />
                <Route path="/wallpaper_ocean" element={<WallpaperOcean baseUrl={relativeUrl} />} />

                {/* 宇宙の設定画面と、海の青系設定画面が混在しないようクエリ等で出し分けできるように設定 */}
                <Route path="/settings" element={<Settings baseUrl={relativeUrl} />} />
                <Route path="/collection" element={<Collection baseUrl={relativeUrl} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;