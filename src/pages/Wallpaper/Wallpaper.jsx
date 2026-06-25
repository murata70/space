import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Wallpaper.css";
import "../../styles/primary-monitor-ui.css";

import Clock from "../../components/ui/Clock/Clock";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";

// マウスイベントを透過させずに、アプリ側でクリックを検知するセレクタのリスト
const WALLPAPER_PASSTHROUGH_SELECTORS = [
    ".top-ui",
    ".icon-btn",         // 追加: フォルダやギアのボタン自体をクリック可能にする
    ".top-ui-actions"    // 追加: ボタンの親要素エリアも安全にカバー
];

const WALLPAPER_DOCUMENT_PASSTHROUGH_SELECTORS = [
    ".rocket-position",
    ".rocket-wrapper",
];

const WALLPAPER_UI_HOVER_SELECTORS = [".top-ui"];

const Wallpaper = () => {
    const navigate = useNavigate();
    const wallpaperRef = useRef(null);
    const { isUiLayerHovered } = useWallpaperMousePassthrough(
        {
            passthroughSelectors: WALLPAPER_PASSTHROUGH_SELECTORS,
            documentPassthroughSelectors: WALLPAPER_DOCUMENT_PASSTHROUGH_SELECTORS,
            uiLayerHoveredSelectors: WALLPAPER_UI_HOVER_SELECTORS,
        },
        wallpaperRef
    );

    return (
        <div className="wallpaper" ref={wallpaperRef}>
            <div className="primary-monitor-ui">
                <div
                    className={`wallpaper-ui-layer ${isUiLayerHovered ? "hovered" : ""}`}
                >
                    <div className="top-ui">
                        <Clock />

                        <div className="top-ui-actions">
                            <button
                                className="icon-btn"
                                onClick={() => navigate("/collection")}
                            >
                                📁
                            </button>
                            <button
                                className="icon-btn"
                                onClick={() => navigate("/settings")}
                            >
                                ⚙️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallpaper;