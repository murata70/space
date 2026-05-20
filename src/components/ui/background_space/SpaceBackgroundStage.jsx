import { usePrimaryDisplayLayout } from "../../../hooks/usePrimaryDisplayLayout";
import BackGround from "./BackGround";
import StarField from "../StarField/StarField";
import Planets from "../Planets/Planets";
import SpaceDust from "../SpaceDust/SpaceDust";
import "./space_viewport.css";

/**
 * 宇宙テーマ背景をメインモニター1画面分のビューポートに描画
 */
export default function SpaceBackgroundStage({ children, className = "" }) {
    const stageLayoutRef = usePrimaryDisplayLayout();

    const rootClass = ["space-background-primary", className]
        .filter(Boolean)
        .join(" ");

    return (
        <div ref={stageLayoutRef} className={rootClass}>
            <BackGround />
            <StarField />
            <Planets />
            <SpaceDust />
            {children ? (
                <div className="space-scene-layer">{children}</div>
            ) : null}
        </div>
    );
}
