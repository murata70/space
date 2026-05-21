import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { refreshPrimaryDisplayLayout } from "./usePrimaryDisplayLayout";
import {
    collectionRouteForTheme,
    setWallpaperTheme,
} from "../utils/wallpaperTheme";

export const COLLECTION_THEMES = [
    { id: "space", name: "宇宙" },
    { id: "ocean", name: "海", locked: false },
    { id: "forest", name: "未定", locked: true },
];

export function useCollectionThemeSelect() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [pendingTheme, setPendingTheme] = useState(null);

    const requestTheme = (themeId) => {
        const theme = COLLECTION_THEMES.find((t) => t.id === themeId);
        if (!theme || theme.locked) return;
        setPendingTheme(theme);
    };

    const confirmTheme = async () => {
        if (!pendingTheme) return;

        const theme = pendingTheme;
        setPendingTheme(null);

        setWallpaperTheme(theme.id);
        const targetRoute = collectionRouteForTheme(theme.id);

        if (pathname !== targetRoute) {
            navigate(targetRoute);
        }

        await refreshPrimaryDisplayLayout();
        window.electron?.refreshDisplayLayout?.();
        window.electron?.attachWallpaper?.();
    };

    const cancelTheme = () => setPendingTheme(null);

    return {
        pendingTheme,
        requestTheme,
        confirmTheme,
        cancelTheme,
    };
}
