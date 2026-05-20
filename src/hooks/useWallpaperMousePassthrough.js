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

/**
 * 壁紙モードのマウス透過を、操作可能領域の座標で切り替える。
 * setIgnoreMouseEvents(true, { forward: true }) では mouseenter が不安定なため、
 * mousemove / pointerdown でヒット判定する。
 */
export function useWallpaperMousePassthrough(selectors, rootRef = null) {
    const [isInteractive, setIsInteractive] = useState(false);
    const interactiveRef = useRef(false);

    const applyPassthrough = useCallback((interactive) => {
        if (interactiveRef.current === interactive) return;
        interactiveRef.current = interactive;
        setIsInteractive(interactive);
        if (typeof window.electron?.setIgnoreMouse === "function") {
            window.electron.setIgnoreMouse(!interactive);
        }
    }, []);

    const selectorsKey = selectors.join("|");

    useEffect(() => {
        if (typeof window.electron?.setIgnoreMouse === "function") {
            window.electron.setIgnoreMouse(true);
        }
        interactiveRef.current = false;
        setIsInteractive(false);

        const updateFromPoint = (clientX, clientY) => {
            const root = rootRef?.current ?? null;
            const interactive = isOverInteractiveRegions(
                clientX,
                clientY,
                selectors,
                root
            );
            applyPassthrough(interactive);
        };

        const onMouseMove = (e) => updateFromPoint(e.clientX, e.clientY);
        const onPointerDown = (e) => updateFromPoint(e.clientX, e.clientY);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("pointermove", onMouseMove);
        window.addEventListener("pointerdown", onPointerDown, true);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("pointermove", onMouseMove);
            window.removeEventListener("pointerdown", onPointerDown, true);
            if (typeof window.electron?.setIgnoreMouse === "function") {
                window.electron.setIgnoreMouse(false);
            }
        };
    }, [selectorsKey, rootRef, applyPassthrough]);

    return isInteractive;
}
