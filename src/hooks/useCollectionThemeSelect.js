import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { refreshPrimaryDisplayLayout } from "./usePrimaryDisplayLayout";
import {
    collectionRouteForTheme,
    setWallpaperTheme,
} from "../utils/wallpaperTheme";
import {
    isSpaceCollectionComplete,
    OCEAN_THEME_UNLOCK_MESSAGE,
} from "../utils/spaceCollectionProgress";

export function getCollectionThemes(spaceComplete = isSpaceCollectionComplete()) {
    return [
        { id: "space", name: "宇宙" },
        {
            id: "ocean",
            name: "海",
            locked: !spaceComplete,
            lockedMessage: OCEAN_THEME_UNLOCK_MESSAGE,
        },
        { id: "forest", name: "未定", locked: true },
    ];
}

export function useCollectionThemeSelect() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [pendingTheme, setPendingTheme] = useState(null);
    const [spaceComplete, setSpaceComplete] = useState(isSpaceCollectionComplete);

    const themes = getCollectionThemes(spaceComplete);

    const requestTheme = (themeId) => {
        const theme = themes.find((t) => t.id === themeId);
        if (!theme || theme.locked) return;
        setPendingTheme(theme);
    };

    const confirmTheme = async () => {
        if (!pendingTheme) return;

        const theme = pendingTheme;
        setPendingTheme(null);

        if (theme.id === "ocean" && !isSpaceCollectionComplete()) {
            setSpaceComplete(false);
            return;
        }

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

    const refreshThemeUnlockState = useCallback(() => {
        setSpaceComplete(isSpaceCollectionComplete());
    }, []);

    return {
        themes,
        pendingTheme,
        requestTheme,
        confirmTheme,
        cancelTheme,
        refreshThemeUnlockState,
    };
}
