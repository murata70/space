// space/src/components/ui/Planets/Planets.jsx

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Planets.css";

const planetImages = [
    "assets/image/planets/asteroid.png",
    "assets/image/planets/earth.png",
    "assets/image/planets/moon.png",
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

const publicUrl = (process.env.PUBLIC_URL || "").replace(/\/$/, "");

function toAssetUrl(relativePath) {
    const path = relativePath.replace(/^\//, "");
    return publicUrl ? `${publicUrl}/${path}` : `/${path}`;
}

export default function Planets() {
    const [planet, setPlanet] = useState(null);
    const [flowWidth, setFlowWidth] = useState("100vw");

    const layerRef = useRef(null);
    const historyRef = useRef([]);
    const spawnTimeoutRef = useRef(null);
    const spawnPlanetRef = useRef(null);

    const measureFlowWidth = useCallback(() => {
        const stage =
            layerRef.current?.closest(".space-background-primary") ??
            document.querySelector(".space-background-primary");

        const rectWidth = stage?.getBoundingClientRect().width ?? 0;
        if (rectWidth > 0) {
            setFlowWidth(`${Math.round(rectWidth)}px`);
            return;
        }

        const primaryWidth = stage
            ? getComputedStyle(stage).getPropertyValue("--primary-width").trim()
            : getComputedStyle(document.documentElement)
                  .getPropertyValue("--primary-width")
                  .trim();

        if (primaryWidth) {
            setFlowWidth(primaryWidth);
        }
    }, []);

    useLayoutEffect(() => {
        measureFlowWidth();

        const stage =
            layerRef.current?.closest(".space-background-primary") ??
            document.querySelector(".space-background-primary");

        if (!stage) return undefined;

        let observer;
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(measureFlowWidth);
            observer.observe(stage);
        }

        window.addEventListener("resize", measureFlowWidth);

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", measureFlowWidth);
        };
    }, [measureFlowWidth, planet]);

    const scheduleNextPlanet = useCallback(() => {
        clearTimeout(spawnTimeoutRef.current);
        spawnTimeoutRef.current = setTimeout(() => {
            spawnPlanetRef.current?.();
        }, WAIT_TIME);
    }, []);

    useEffect(() => {
        const spawnPlanet = () => {
            const history = historyRef.current;

            const available = planetImages.filter(
                (img) => !history.includes(img)
            );

            const targetList =
                available.length > 0 ? available : planetImages;

            const randomImage =
                targetList[Math.floor(Math.random() * targetList.length)];

            const size = Math.random() * 400 + 800;
            const top = Math.random() * 80 - 80;

            setPlanet({
                id: Date.now(),
                image: randomImage,
                size,
                top,
            });

            historyRef.current = [...history, randomImage].slice(-3);

            clearTimeout(spawnTimeoutRef.current);
            spawnTimeoutRef.current = setTimeout(() => {
                spawnPlanetRef.current?.();
            }, FLOW_TIME * 1000 + WAIT_TIME);
        };

        spawnPlanetRef.current = spawnPlanet;
        spawnPlanet();

        return () => clearTimeout(spawnTimeoutRef.current);
    }, []);

    return (
        <div className="planet-layer" ref={layerRef}>
            {planet ? (
                <img
                    key={planet.id}
                    src={toAssetUrl(planet.image)}
                    alt="planet"
                    className="planet-object"
                    onAnimationEnd={(event) => {
                        if (event.target !== event.currentTarget) return;
                        scheduleNextPlanet();
                    }}
                    style={{
                        top: `${planet.top}%`,
                        width: `${planet.size}px`,
                        left: flowWidth,
                        "--space-vw": flowWidth,
                        "--planet-size": `${planet.size}px`,
                        animationDuration: `${FLOW_TIME}s`,
                    }}
                />
            ) : null}
        </div>
    );
}
