/** 壁紙を張ったままにするルート（全モニター背景 + メインに UI） */
export const WALLPAPER_ATTACHED_ROUTES = new Set([
    "/wallpaper",
    "/wallpaper_ocean",
    "/settings",
    "/collection",
    "/settings_ocean",
    "/collection_ocean",
]);

export const SPACE_THEME_ROUTES = new Set([
    "/wallpaper",
    "/settings",
    "/collection",
]);

export const OCEAN_THEME_ROUTES = new Set([
    "/wallpaper_ocean",
    "/settings_ocean",
    "/collection_ocean",
]);

export function isWallpaperAttachedRoute(pathname) {
    return WALLPAPER_ATTACHED_ROUTES.has(pathname || "/");
}
