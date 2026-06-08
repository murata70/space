// space/src/components/ui/Planets/Planets.jsx

import { useEffect, useRef, useState } from "react";
import "./Planets.css";

// 先頭のスラッシュを削除し、publicUrlを結合しやすくします
const planetImages = [
    "assets/image/planets/asteroid.png",
    "assets/image/planets/planet1_1.png",
    "assets/image/planets/planet1_2.png",
    "assets/image/planets/planet1_3.png",
    "assets/image/planets/planet2_1.png",
    "assets/image/planets/planet3_1.png",
    "assets/image/planets/planet4_1.png",
    "assets/image/planets/planet5_1.png",
    "assets/image/planets/planet6_1.png",
    "assets/image/planets/planet7_1.png",
    "assets/image/planets/planet8_1.png",
    "assets/image/planets/planet9_1.png",
    "assets/image/planets/planet10_1.png",
    "assets/image/planets/planet11_1.png",
    "assets/image/planets/planet12_1.png",
    "assets/image/planets/planet13_1.png",
    "assets/image/planets/sun_1.png",
    "assets/image/planets/sun_2.png",
    "assets/image/planets/sun_3.png",
];

const FLOW_TIME = 180; // 秒
const WAIT_TIME = 2500; // 2.5秒

export default function Planets() {
    const [planet, setPlanet] = useState(null);
    const publicUrl = process.env.PUBLIC_URL || "";

    // 直近3回の履歴
    const historyRef = useRef([]);

    useEffect(() => {
        let timeoutId;

        const spawnPlanet = () => {
            const history = historyRef.current;

            // 直近3回を除外
            const available = planetImages.filter(
                (img) => !history.includes(img)
            );

            const targetList =
                available.length > 0
                    ? available
                    : planetImages;

            const randomImage =
                targetList[
                Math.floor(Math.random() * targetList.length)
                ];

            // サイズ（--space-vw 基準・レスポンシブ）
            const sizeVw = Math.random() * 0.2 + 0.35;
            const size = `clamp(320px, calc(var(--space-vw, 100vw) * ${sizeVw}), 1200px)`;

            // 垂直位置: 惑星サイズに対する上方向のはみ出し率（35〜48% → 52%以上が画面内）
            const peekHidden = Math.random() * 0.13 + 0.35;

            setPlanet({
                id: Date.now(),
                image: randomImage,
                size,
                peekHidden,
            });

            // 履歴更新
            historyRef.current = [
                ...history,
                randomImage,
            ].slice(-3);

            // 180秒 + 5秒後に次
            timeoutId = setTimeout(() => {
                spawnPlanet();
            }, FLOW_TIME * 1000 + WAIT_TIME);
        };

        spawnPlanet();

        return () => clearTimeout(timeoutId);
    }, []);

    if (!planet) return null;

    return (
        <div className="planet-layer">
            <img
                key={planet.id}
                /* ここでpublicUrlを結合して正しいパスを生成します */
                src={`${publicUrl}/${planet.image}`}
                alt="planet"
                className="planet-object"
                style={{
                    top: `calc(var(--planet-size) * -${planet.peekHidden})`,
                    width: planet.size,
                    // 右端外（FlagFlow と同じ --space-vw 基準）
                    left: "var(--space-vw, 100vw)",
                    "--planet-size": planet.size,
                    animation: `flowPlanet ${FLOW_TIME}s linear forwards`,
                }}
            />
        </div>
    );
}