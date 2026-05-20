const STORAGE_KEY = "wallpaper_theme";

export function getWallpaperTheme() {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        if (value === "ocean" || value === "space") return value;
    } catch {
        /* ignore */
    }
    return "space";
}

export function setWallpaperTheme(themeId) {
    try {
        localStorage.setItem(STORAGE_KEY, themeId);
    } catch (e) {
        console.error("壁紙テーマの保存に失敗", e);
    }
}

export function wallpaperRouteForTheme(themeId) {
    return themeId === "ocean" ? "/wallpaper_ocean" : "/wallpaper";
}

export function collectionRouteForTheme(themeId) {
    return themeId === "ocean" ? "/collection_ocean" : "/collection";
}
