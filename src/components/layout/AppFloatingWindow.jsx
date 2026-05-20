import { useRef } from "react";
import { usePrimaryDisplayLayout } from "../../hooks/usePrimaryDisplayLayout";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";
import "../../styles/primary-monitor-ui.css";
import "./AppFloatingWindow.css";

/**
 * 壁紙の上に載せるメインモニター内の「ウィンドウ」UI
 */
export default function AppFloatingWindow({
    children,
    passthroughSelectors = [".app-floating-window"],
}) {
    const shellRef = useRef(null);
    const primaryLayoutRef = usePrimaryDisplayLayout();
    useWallpaperMousePassthrough({ passthroughSelectors }, shellRef);

    return (
        <div className="app-floating-shell" ref={shellRef}>
            <div className="primary-monitor-ui" ref={primaryLayoutRef}>
                <div className="app-floating-window">{children}</div>
            </div>
        </div>
    );
}
