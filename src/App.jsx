import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home/Home";
import Wallpaper from "./pages/Wallpaper/Wallpaper";
import Settings from "./pages/Settings/Settings";
import Collection from "./pages/Collection/Collection";

import WallpaperOcean from "./pages/Wallpaper/Wallpaper_ocean";
import Settings_ocean from "./pages/Settings/Settings_ocean";
import Collection_ocean from "./pages/Collection/Collection_ocean";

import SpaceWallpaperBackdrop from "./components/wallpaper/SpaceWallpaperBackdrop";
import OceanWallpaperBackdrop from "./components/wallpaper/OceanWallpaperBackdrop";
import {
    SPACE_THEME_ROUTES,
    OCEAN_THEME_ROUTES,
} from "./constants/wallpaperRoutes";
import {
    useAppPrimaryDisplayLayout,
    useWallpaperRouteSync,
} from "./hooks/usePrimaryDisplayLayout";

function AppContent() {
    const baseUrl = window.location.origin || "";
    const { pathname } = useLocation();

    useAppPrimaryDisplayLayout(pathname);
    useWallpaperRouteSync(pathname);

    const showSpaceBackdrop =
        SPACE_THEME_ROUTES.has(pathname) &&
        pathname !== "/wallpaper";
    const showOceanBackdrop =
        OCEAN_THEME_ROUTES.has(pathname) &&
        pathname !== "/wallpaper_ocean";

    return (
        <>
            {showSpaceBackdrop && <SpaceWallpaperBackdrop />}
            {showOceanBackdrop && (
                <OceanWallpaperBackdrop baseUrl={baseUrl} />
            )}

            <Routes>
                <Route path="/" element={<Home baseUrl={baseUrl} />} />

                <Route path="/wallpaper" element={<Wallpaper baseUrl={baseUrl} />} />
                <Route path="/settings" element={<Settings baseUrl={baseUrl} />} />
                <Route path="/collection" element={<Collection baseUrl={baseUrl} />} />

                <Route
                    path="/wallpaper_ocean"
                    element={<WallpaperOcean baseUrl={baseUrl} />}
                />
                <Route
                    path="/settings_ocean"
                    element={<Settings_ocean baseUrl={baseUrl} />}
                />
                <Route
                    path="/collection_ocean"
                    element={<Collection_ocean baseUrl={baseUrl} />}
                />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
