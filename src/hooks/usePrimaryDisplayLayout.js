import { useEffect } from "react";
import { isWallpaperAttachedRoute } from "../constants/wallpaperRoutes";

export function applyLayoutToElement(el, layout) {
    if (!el || !layout?.primary) return;
    const { primary } = layout;
    el.style.setProperty("--primary-offset-x", `${primary.offsetX}px`);
    el.style.setProperty("--primary-offset-y", `${primary.offsetY}px`);
    el.style.setProperty("--primary-width", `${primary.width}px`);
    el.style.setProperty("--primary-height", `${primary.height}px`);
}

/**
 * マルチモニター時、メインディスプレイの矩形を CSS 変数でルートに設定する。
 * .primary-monitor-ui がその範囲に UI を収める。
 */
export function usePrimaryDisplayLayout(rootRef) {
    useEffect(() => {
        const root = rootRef?.current;
        if (!root) return undefined;

        const apply = (layout) => applyLayoutToElement(root, layout);

        window.electron?.getDisplayLayout?.().then(apply);

        const unsubscribe = window.electron?.onDisplayLayoutChanged?.(apply);

        const onResize = () => {
            window.electron?.getDisplayLayout?.().then(apply);
        };
        window.addEventListener("resize", onResize);

        return () => {
            unsubscribe?.();
            window.removeEventListener("resize", onResize);
        };
    }, [rootRef]);
}

/** 壁紙モード中は :root にメインディスプレイ矩形を反映（全ルートで .primary-monitor-ui が使える） */
export function useAppPrimaryDisplayLayout(pathname) {
    const enabled = isWallpaperAttachedRoute(pathname);

    useEffect(() => {
        if (!enabled) return undefined;

        const apply = (layout) =>
            applyLayoutToElement(document.documentElement, layout);

        window.electron?.getDisplayLayout?.().then(apply);

        const unsubscribe = window.electron?.onDisplayLayoutChanged?.(apply);

        const onResize = () => {
            window.electron?.getDisplayLayout?.().then(apply);
        };
        window.addEventListener("resize", onResize);

        return () => {
            unsubscribe?.();
            window.removeEventListener("resize", onResize);
        };
    }, [enabled, pathname]);
}

/** ルート変更時にメインプロセスへ壁紙モードを再同期 */
export function useWallpaperRouteSync(pathname) {
    useEffect(() => {
        if (!isWallpaperAttachedRoute(pathname)) return;
        window.electron?.attachWallpaper?.();
    }, [pathname]);
}
