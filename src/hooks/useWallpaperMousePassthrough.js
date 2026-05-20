import { useCallback, useEffect, useRef, useState } from "react";
import { useElectronCursorPoll } from "./useElectronCursorPoll";
import {
    getSlideExpandedHitRect,
    isPointInRect,
} from "../utils/slideHitTest";

function isPointOverSelectorRect(clientX, clientY, selector, scope) {
    const nodes = scope.querySelectorAll(selector);
    for (const node of nodes) {
        if (node.classList?.contains("slide-area--hover-expand")) {
            const expanded = getSlideExpandedHitRect(node);
            if (isPointInRect(clientX, clientY, expanded)) {
                return true;
            }
        }

        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && isPointInRect(clientX, clientY, rect)) {
            return true;
        }
    }
    return false;
}

/** elementFromPoint（通常ブラウザ用フォールバック） */
function isOverInteractiveByElement(clientX, clientY, selectors, root) {
    const scope = root || document;
    const el = document.elementFromPoint(clientX, clientY);
    if (!el || !scope.contains(el)) return false;

    for (const selector of selectors) {
        if (el.closest(selector)) return true;
    }
    return false;
}

function isOverInteractiveRegions(clientX, clientY, selectors, root) {
    if (clientX == null || clientY == null) return false;

    const scope = root || document;

    for (const selector of selectors) {
        if (isPointOverSelectorRect(clientX, clientY, selector, scope)) {
            return true;
        }
    }

    return isOverInteractiveByElement(clientX, clientY, selectors, root);
}

/**
 * 壁紙モード: カーソル位置で操作領域を検出し setIgnoreMouse でクリック可能にする
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

    const updateFromPoint = useCallback(
        (clientX, clientY) => {
            const root = rootRef?.current ?? null;
            const hasElectron =
                typeof window.electron?.setIgnoreMouse === "function";

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
        },
        [
            rootRef,
            passthroughSelectors,
            uiLayerHoveredSelectors,
            setMouseInteractive,
        ]
    );

    useEffect(() => {
        const hasElectron =
            typeof window.electron?.setIgnoreMouse === "function";

        uiHoveredRef.current = false;
        interactiveRef.current = false;
        setIsUiLayerHovered(false);

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
    }, [passthroughKey, uiHoverKey, updateFromPoint, setMouseInteractive]);

    useElectronCursorPoll(
        (x, y) => updateFromPoint(x, y),
        typeof window.electron?.getCursorClientPoint === "function",
        32
    );

    useEffect(() => {
        if (isUiLayerHovered) {
            setMouseInteractive(true);
        }
    }, [isUiLayerHovered, setMouseInteractive]);

    return { isUiLayerHovered };
}
