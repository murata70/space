import { useEffect, useRef, useState } from "react";
import "./UFOFlow.css";

export default function UFOFlow({ onComplete }) {
    const publicUrl = process.env.PUBLIC_URL || "";

    const BOUND = 180;

    const posRef = useRef({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });

    const velRef = useRef({
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 14,
    });

    const targetVelRef = useRef({ ...velRef.current });

    const [pos, setPos] = useState(posRef.current);
    const [phase, setPhase] = useState("move");

    const lerp = (a, b, t) => a + (b - a) * t;

    useEffect(() => {
        let frame;
        let directionTimer;

        const changeDirection = () => {
            const speed = Math.random() > 0.5 ? 18 : 10;

            targetVelRef.current = {
                x: (Math.random() - 0.5) * speed,
                y: (Math.random() - 0.5) * speed,
            };
        };

        const loop = () => {
            const pos = posRef.current;
            const vel = velRef.current;
            const target = targetVelRef.current;

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            // -----------------------------
            // ① ピュン移動（慣性）
            // -----------------------------
            vel.x = lerp(vel.x, target.x, 0.10);
            vel.y = lerp(vel.y, target.y, 0.10);

            // -----------------------------
            // ② 中央への弱い引力（重要）
            // -----------------------------
            vel.x += (cx - pos.x) * 0.0008;
            vel.y += (cy - pos.y) * 0.0008;

            pos.x += vel.x;
            pos.y += vel.y;

            // -----------------------------
            // ③ ソフトバウンダリ（外に行きすぎ防止）
            // -----------------------------
            const maxX = window.innerWidth + BOUND;
            const minX = -BOUND;
            const maxY = window.innerHeight + BOUND;
            const minY = -BOUND;

            if (pos.x < minX) {
                velRef.current.x = Math.abs(velRef.current.x) * 0.8;
                targetVelRef.current.x = Math.abs(targetVelRef.current.x);
            }

            if (pos.x > maxX) {
                velRef.current.x = -Math.abs(velRef.current.x) * 0.8;
                targetVelRef.current.x = -Math.abs(targetVelRef.current.x);
            }

            if (pos.y < minY) {
                velRef.current.y = Math.abs(velRef.current.y) * 0.8;
                targetVelRef.current.y = Math.abs(targetVelRef.current.y);
            }

            if (pos.y > maxY) {
                velRef.current.y = -Math.abs(velRef.current.y) * 0.8;
                targetVelRef.current.y = -Math.abs(targetVelRef.current.y);
            }

            posRef.current = pos;
            setPos({ ...pos });

            frame = requestAnimationFrame(loop);
        };

        directionTimer = setInterval(() => {
            changeDirection();
        }, Math.random() * 1200 + 900);

        const fadeTimer = setTimeout(() => {
            setPhase("out");
        }, 20000);

        const endTimer = setTimeout(() => {
            onComplete?.();
        }, 23000);

        frame = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frame);
            clearInterval(directionTimer);
            clearTimeout(fadeTimer);
            clearTimeout(endTimer);
        };
    }, [onComplete]);

    return (
        <div className={`ufo-flow-wrapper ufo-phase-${phase}`}>
            <div
                className="ufo-flow-object"
                style={{
                    left: pos.x,
                    top: pos.y,
                }}
            >
                <div className="ufo-aura" />
                <img
                    src={`${publicUrl}/assets/image/collections/ufo.png`}
                    alt="ufo"
                    className="ufo-flow-image"
                />
            </div>
        </div>
    );
}