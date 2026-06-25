import { useCallback, useEffect, useRef, useState } from "react";
import { useElectronCursorPoll } from "./useElectronCursorPoll";
import { isPointInRect, isPointOverSlideZone } from "../utils/slideHitTest";

function isPointOverSelectorRect(clientX, clientY, selector, scope) {
    const nodes = scope.querySelectorAll(selector);
    for (const node of nodes) {
        if (node.classList?.contains("slide-area--hover-expand")) {
            const isOpen = node.classList.contains("is-hovered");
            if (isPointOverSlideZone(node, clientX, clientY, isOpen)) {
                return true;
            }

            continue;
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

/** 確認ダイアログや設定画面などのオーバーレイ表示中は座標ずれで透過に戻さない */
function hasBlockingOverlay(root) {
    const scope = root || document;
    return Boolean(
        scope.querySelector?.(".theme-confirm-overlay") ||
        scope.querySelector?.(".settings-container") || // 宇宙設定画面のコンテナ
        scope.querySelector?.(".settings-ocean-container") || // 海設定画面のコンテナ
        scope.querySelector?.(".settings-window") || // 設定画面ウィンドウ自体
        document.querySelector(".theme-confirm-overlay") ||
        document.querySelector(".settings-container") ||
        document.querySelector(".settings-ocean-container") ||
        document.querySelector(".settings-window")
    );
}

function setInteractiveState(interactiveRef, interactive, setMouseInteractive, hasElectron) {
    if (interactiveRef.current !== interactive) {
        interactiveRef.current = interactive;
        if (hasElectron) {
            setMouseInteractive(interactive);
        }
    }
}

/**
 * 壁紙モード: カーソル位置で操作領域を検出し setIgnoreMouse でクリック可能にする
 */
export function useWallpaperMousePassthrough(
    {
        passthroughSelectors,
        documentPassthroughSelectors = [],
        uiLayerHoveredSelectors = [],
    },
    rootRef = null
) {
    const [isUiLayerHovered, setIsUiLayerHovered] = useState(false);
    const uiHoveredRef = useRef(false);
    const interactiveRef = useRef(false);

    // 設定・コレクション用共通インタラクティブセレクターを追加
    const extendedSelectors = [
        ...passthroughSelectors,
        ".settings-window",
        ".settings-container",
        ".settings-ocean-container",
        "button",
        "input",
        "select"
    ];

    const passthroughKey = extendedSelectors.join("|");
    const documentPassthroughKey = documentPassthroughSelectors.join("|");
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

            if (hasBlockingOverlay(root)) {
                setInteractiveState(
                    interactiveRef,
                    true, // オーバーレイがある場合は常にインタラクティブ（透過解除）
                    setMouseInteractive,
                    hasElectron
                );
                return;
            }

            const interactive =
                isOverInteractiveRegions(
                    clientX,
                    clientY,
                    extendedSelectors,
                    root
                ) ||
                isOverInteractiveRegions(
                    clientX,
                    clientY,
                    documentPassthroughSelectors,
                    document
                );

            setInteractiveState(
                interactiveRef,
                interactive,
                setMouseInteractive,
                hasElectron
            );

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
            passthroughKey,
            documentPassthroughKey,
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
    }, [passthroughKey, documentPassthroughKey, uiHoverKey, updateFromPoint, setMouseInteractive]);

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