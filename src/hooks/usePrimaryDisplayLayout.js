import { useCallback, useEffect, useState } from "react";
import { isWallpaperAttachedRoute } from "../constants/wallpaperRoutes";

export function applyLayoutToElement(el, layout) {
    if (!el || !layout?.primary) return;
    const { primary } = layout;
    el.style.setProperty("--primary-offset-x", `${primary.offsetX}px`);
    el.style.setProperty("--primary-offset-y", `${primary.offsetY}px`);
    el.style.setProperty("--primary-width", `${primary.width}px`);
    el.style.setProperty("--primary-height", `${primary.height}px`);
}

/** メインディスプレイ矩形を :root と任意要素へ反映 */
export async function refreshPrimaryDisplayLayout(targetEl = null) {
    const layout = await window.electron?.getDisplayLayout?.();
    if (!layout) return layout;
    applyLayoutToElement(document.documentElement, layout);
    if (targetEl) applyLayoutToElement(targetEl, layout);
    return layout;
}

/**
 * マルチモニター時、メインディスプレイの矩形を CSS 変数で設定する。
 * callback ref でマウント後も確実に適用（ダイアログ等の条件付きマウント向け）。
 */
export function usePrimaryDisplayLayout() {
    const [target, setTarget] = useState(null);
    const ref = useCallback((node) => setTarget(node), []);

    useEffect(() => {
        const apply = (layout) => {
            applyLayoutToElement(document.documentElement, layout);
            if (target) applyLayoutToElement(target, layout);
        };

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
    }, [target]);

    return ref;
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
