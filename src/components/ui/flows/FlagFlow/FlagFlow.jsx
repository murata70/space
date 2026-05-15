import { useEffect, useState } from "react";
import "./FlagFlow.css";

export default function FlagFlow({ onComplete }) {
    // マウント時に決定するランダムな高さの状態管理
    const [randomTop, setRandomTop] = useState("30%");

    useEffect(() => {
        // 画面の下4分の1(75%以下)を避け、上端に寄りすぎない 5% 〜 65% の範囲でランダム設定
        const minTop = 5;
        const maxTop = 65;
        const calculatedTop = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
        setRandomTop(`${calculatedTop}%`);

        // アニメーション時間 40秒 に合わせて終了通知を実行
        const flagEndTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 40000);

        return () => {
            clearTimeout(flagEndTimer);
        };
    }, [onComplete]);

    return (
        <div className="flag-flow-outer-wrap">
            <img
                src="/assets/image/collections/flag.png"
                alt="End Credits Flag"
                className="flag-flow-main-img"
                style={{ top: randomTop }} // JSで計算した高さを適用
                draggable="false"
            />
        </div>
    );
}