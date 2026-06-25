import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isSpaceCollectionComplete } from "../utils/spaceCollectionProgress";
import { wallpaperRouteForTheme } from "../utils/wallpaperTheme";

/** 海テーマルートは宇宙コレクションコンプリート後のみ */
export function useOceanThemeAccessGuard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (isSpaceCollectionComplete()) return;
        navigate("/collection", { replace: true });
    }, [navigate]);
}

export function useOceanWallpaperDismissRoute() {
    return isSpaceCollectionComplete()
        ? wallpaperRouteForTheme("ocean")
        : "/collection";
}
