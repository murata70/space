import { useCallback, useEffect, useRef, useState } from "react";

function isPointInRect(x, y, rect) {
    if (!rect) return false;
    return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
    );
}

function isOverInteractiveRegions(clientX, clientY, selectors, root) {
    const scope = root || document;
    for (const selector of selectors) {
        const el = scope.querySelector(selector);
        if (!el) continue;
        if (isPointInRect(clientX, clientY, el.getBoundingClientRect())) {
            return true;
        }
    }
    return false;
}

function collectNormalizedRegions(selectors, root) {
    const scope = root || document;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (!w || !h) return [];

    return selectors
        .map((selector) => {
            const el = scope.querySelector(selector);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
                left: r.left / w,
                top: r.top / h,
                right: r.right / w,
                bottom: r.bottom / h,
            };
        })
        .filter(Boolean);
}

/**
 * 壁紙モードの操作領域を管理する。
 * - passthroughSelectors: Electron のマウス透過を解除する領域（ボタン・ロケット等）
 * - uiLayerHoveredSelectors: wallpaper-ui-layer の hovered を付ける領域（右上 UI のみ）
 *
 * Electron ではメインプロセスのカーソル監視で透過を切り替え（mousemove 非依存）。
 */
export function useWallpaperMousePassthrough(
    { passthroughSelectors, uiLayerHoveredSelectors = [] },
    rootRef = null
) {
    const [isUiLayerHovered, setIsUiLayerHovered] = useState(false);
    const uiHoveredRef = useRef(false);
    const usesMainHitTest =
        typeof window.electron?.updateHitRegions === "function";

    const passthroughKey = passthroughSelectors.join("|");
    const uiHoverKey = uiLayerHoveredSelectors.join("|");

    const publishRegions = useCallback(() => {
        if (!usesMainHitTest) return;
        const root = rootRef?.current ?? null;
        const regions = collectNormalizedRegions(passthroughSelectors, root);
        window.electron.updateHitRegions(regions);
    }, [usesMainHitTest, passthroughKey, rootRef, passthroughSelectors]);

    const applyRendererPassthrough = useCallback(
        (interactive) => {
            if (usesMainHitTest) return;
            if (typeof window.electron?.setIgnoreMouse === "function") {
                window.electron.setIgnoreMouse(!interactive);
            }
        },
        [usesMainHitTest]
    );

    useEffect(() => {
        if (usesMainHitTest) {
            window.electron.startHitTest?.();
        } else if (typeof window.electron?.setIgnoreMouse === "function") {
            window.electron.setIgnoreMouse(true);
        }

        uiHoveredRef.current = false;
        setIsUiLayerHovered(false);

        const updateFromPoint = (clientX, clientY) => {
            const root = rootRef?.current ?? null;

            const interactive = isOverInteractiveRegions(
                clientX,
                clientY,
                passthroughSelectors,
                root
            );
            applyRendererPassthrough(interactive);

            if (uiLayerHoveredSelectors.length > 0) {
                const uiHover = isOverInteractiveRegions(
                    clientX,
                    clientY,
                    uiLayerHoveredSelectors,
                    root
                );
                if (uiHoveredRef.current !== uiHover) {
                    uiHoveredRef.current = uiHover;
                    setIsUiLayerHovered(uiHover);
                }
            }
        };

        const onMouseMove = (e) => updateFromPoint(e.clientX, e.clientY);
        const onPointerDown = (e) => updateFromPoint(e.clientX, e.clientY);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("pointermove", onMouseMove);
        window.addEventListener("pointerdown", onPointerDown, true);
        window.addEventListener("resize", publishRegions);

        publishRegions();
        const regionTimer = setInterval(publishRegions, 500);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("pointermove", onMouseMove);
            window.removeEventListener("pointerdown", onPointerDown, true);
            window.removeEventListener("resize", publishRegions);
            clearInterval(regionTimer);

            if (usesMainHitTest) {
                window.electron.stopHitTest?.();
            } else if (typeof window.electron?.setIgnoreMouse === "function") {
                window.electron.setIgnoreMouse(false);
            }
        };
    }, [
        passthroughKey,
        uiHoverKey,
        rootRef,
        passthroughSelectors,
        uiLayerHoveredSelectors,
        applyRendererPassthrough,
        publishRegions,
        usesMainHitTest,
    ]);

    return { isUiLayerHovered };
}
