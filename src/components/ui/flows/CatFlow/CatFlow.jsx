import { useEffect, useState } from "react";
import "./CatFlow.css";
import { saveCollection } from "../../../../utils/collectionStorage";
import { COLLECTION_MASTER } from "../../../../data/collectionMaster";
import catDataJson from "../../../../data/collections/cats.json";

export default function CatFlow({ onComplete }) {
    const [frame, setFrame] = useState(0);
    const catFrames = catDataJson?.cat?.frames || [];

    // マウント時にログを出す
    useEffect(() => {
        console.log("CatFlow: コンポーネントがマウントされました。画像枚数:", catFrames.length);
        if (catFrames.length === 0) {
            console.error("CatFlow: 画像パスが空です。JSONを確認してください。");
        }
    }, [catFrames]);

    useEffect(() => {
        if (catFrames.length === 0) return;

        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % catFrames.length);
        }, 100);

        return () => clearInterval(interval);
    }, [catFrames]);

    const handleAnimationEnd = (e) => {
        console.log("CatFlow: アニメーション終了。保存処理を開始します。");
        const catMasterItem = COLLECTION_MASTER.find((item) => item.id === "cat");
        if (catMasterItem) {
            saveCollection(catMasterItem);
        }

        // デバッグ時は自動で消さないように onComplete を呼ばない、
        // あるいは3秒待ってから消す
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 3000);
    };

    if (catFrames.length === 0) return null;

    return (
        <div
            className="cat-position-container"
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="cat-wrapper">
                <img
                    src={catFrames[frame]}
                    alt="ひかるねこ"
                    className="cat-image"
                    key={frame} /* keyを付けると確実に再描画されます */
                    draggable="false"
                    onError={(e) => console.error("CatFlow: 画像読み込み失敗:", e.target.src)}
                />
            </div>
        </div>
    );
}