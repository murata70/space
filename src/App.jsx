import React from "react";
// 【修正】BrowserRouter から HashRouter に変更
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Wallpaper from "./pages/Wallpaper/Wallpaper";
import Settings from "./pages/Settings/Settings";
import Collection from "./pages/Collection/Collection";

// 海テーマ用
import WallpaperOcean from "./pages/Wallpaper/Wallpaper_ocean";
import Settings_ocean from "./pages/Settings/Settings_ocean";
import Collection_ocean from "./pages/Collection/Collection_ocean";

function App() {
    const baseUrl = window.location.origin || "";

    return (
        // 【修正】Router（HashRouter）を使用
        <Router>
            <Routes>
                {/* ホーム画面 */}
                <Route path="/" element={<Home baseUrl={baseUrl} />} />

                {/* 宇宙（SPACE）テーマ */}
                <Route path="/wallpaper" element={<Wallpaper baseUrl={baseUrl} />} />
                <Route path="/settings" element={<Settings baseUrl={baseUrl} />} />
                <Route path="/collection" element={<Collection baseUrl={baseUrl} />} />

                {/* 海（OCEAN）テーマ */}
                <Route path="/wallpaper_ocean" element={<WallpaperOcean baseUrl={baseUrl} />} />
                <Route path="/settings_ocean" element={<Settings_ocean baseUrl={baseUrl} />} />
                <Route path="/collection_ocean" element={<Collection_ocean baseUrl={baseUrl} />} />
            </Routes>
        </Router>
    );
}

export default App;