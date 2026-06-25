import React, { useState } from "react";
import { usePrimaryDisplayLayout } from "../../hooks/usePrimaryDisplayLayout";
import BackGroundOcean from "./background_ocean/BackGround";
import OceanBg from "./ocean_bg/ocean_bg";
import "./ocean_layout.css";

/**
 * 海テーマ背景（空・道路）をメインモニター1画面分のビューポートに描画
 */
export default function OceanBackgroundStage({
    children,
    className = "",
    showMainCar = false,
}) {
    const stageLayoutRef = usePrimaryDisplayLayout();
    const [passingMount, setPassingMount] = useState(null);

    const rootClass = ["ocean-background-primary", className]
        .filter(Boolean)
        .join(" ");

    return (
        <div ref={stageLayoutRef} className={rootClass}>
            <BackGroundOcean />
            <OceanBg showMainCar={showMainCar} passingMountRef={setPassingMount} />
            {children ? (
                <div className="ocean-scene-layer">
                    {React.cloneElement(React.Children.only(children), {
                        passingMount,
                    })}
                </div>
            ) : null}
        </div>
    );
}
