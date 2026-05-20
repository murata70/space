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

/** elementFromPoint で透過領域判定（壁紙の座標系と一致） */
function isOverInteractiveRegions(clientX, clientY, selectors, root) {
    const scope = root || document;
    const el = document.elementFromPoint(clientX, clientY);
    if (!el || !scope.contains(el)) return false;

    for (const selector of selectors) {
        if (el.closest(selector)) return true;
    }
    return false;
}

/**
 * 壁紙モード: mousemove（forward）で操作領域を検出し setIgnoreMouse でクリック可能にする
 */
export function useWallpaperMousePassthrough(
    { passthroughSelectors, uiLayerHoveredSelectors = [] },
    rootRef = null
) {
    const [isUiLayerHovered, setIsUiLayerHovered] = useState(false);
    const uiHoveredRef = useRef(false);
    const interactiveRef = useRef(false);

    const passthroughKey = passthroughSelectors.join("|");
    const uiHoverKey = uiLayerHoveredSelectors.join("|");

    const setMouseInteractive = useCallback((interactive) => {
        if (typeof window.electron?.setIgnoreMouse !== "function") return;
        window.electron.setIgnoreMouse(!interactive);
    }, []);

    useEffect(() => {
        const hasElectron = typeof window.electron?.setIgnoreMouse === "function";

        uiHoveredRef.current = false;
        interactiveRef.current = false;
        setIsUiLayerHovered(false);

        const updateFromPoint = (clientX, clientY) => {
            const root = rootRef?.current ?? null;

            const interactive = isOverInteractiveRegions(
                clientX,
                clientY,
                passthroughSelectors,
                root
            );

            if (interactiveRef.current !== interactive) {
                interactiveRef.current = interactive;
                if (hasElectron) {
                    setMouseInteractive(interactive);
                }
            }

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
        const onPointerMove = (e) => updateFromPoint(e.clientX, e.clientY);

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("pointermove", onPointerMove);

            if (hasElectron) {
                setMouseInteractive(false);
            }
        };
    }, [
        passthroughKey,
        uiHoverKey,
        rootRef,
        passthroughSelectors,
        uiLayerHoveredSelectors,
        setMouseInteractive,
    ]);

    useEffect(() => {
        if (isUiLayerHovered) {
            setMouseInteractive(true);
        }
    }, [isUiLayerHovered, setMouseInteractive]);

    return { isUiLayerHovered };
}
