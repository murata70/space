import { useCallback, useRef } from "react";
import { usePrimaryDisplayLayout } from "../../hooks/usePrimaryDisplayLayout";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";
import "../../styles/primary-monitor-ui.css";
import "./AppFloatingWindow.css";

/** 外側クリックで閉じない領域（設定・コレクションのパネルと確認ダイアログ） */
export const FLOATING_WINDOW_PANEL_SELECTORS = [
    ".settings-page-container",
    ".collection-wrap",
    ".theme-confirm-overlay",
];

/**
 * 壁紙の上に載せるメインモニター内の「ウィンドウ」UI
 */
export default function AppFloatingWindow({
    children,
    passthroughSelectors = [".app-floating-window"],
    onDismiss,
    dismissExcludeSelectors = FLOATING_WINDOW_PANEL_SELECTORS,
}) {
    const shellRef = useRef(null);
    const primaryLayoutRef = usePrimaryDisplayLayout();
    useWallpaperMousePassthrough({ passthroughSelectors }, shellRef);

    const handleBackdropPointerDown = useCallback(
        (event) => {
            if (!onDismiss) return;

            for (const selector of dismissExcludeSelectors) {
                if (event.target.closest(selector)) return;
            }

            onDismiss();
        },
        [onDismiss, dismissExcludeSelectors]
    );

    return (
        <div className="app-floating-shell" ref={shellRef}>
            <div className="primary-monitor-ui" ref={primaryLayoutRef}>
                <div
                    className="app-floating-window"
                    onPointerDown={handleBackdropPointerDown}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
