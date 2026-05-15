import { useEffect, useState } from "react";
import "./CatFlow.css";

// 画像パスを直接配列に定義
const catFrameAssets = [
    "/assets/image/collections/twinkling_cat1.png",
    "/assets/image/collections/twinkling_cat2.png",
    "/assets/image/collections/twinkling_cat3.png",
];

export default function CatFlow({ onComplete }) {
    const [currentFrameIdx, setCurrentFrameIdx] = useState(0);

    useEffect(() => {
        // 200msごとに画像を切り替えて光っている演出を作る
        const catInterval = setInterval(() => {
            setCurrentFrameIdx((prev) => (prev + 1) % catFrameAssets.length);
        }, 200);

        // 漂流感を出すため、アニメーション時間を30秒(30000ms)に延長
        const catEndTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 30000);

        // クリーンアップ処理
        return () => {
            clearInterval(catInterval);
            clearTimeout(catEndTimer);
        };
    }, [onComplete]);

    return (
        <div className="cat-flow-container">
            <div className="cat-flow-orbit-wrapper">
                <img
                    src={catFrameAssets[currentFrameIdx]}
                    alt="twinkling-cat"
                    className="cat-flow-image"
                    draggable="false"
                />
            </div>
        </div>
    );
}