import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Astronaut2Flow.css";

const publicUrl = process.env.PUBLIC_URL || "";

/**
 * コレクション「助かった宇宙人」演出の尺（Astronaut2Flow.css の暗転 35s と揃える）
 */
const FLOW_DURATION_MS = 35000;

/**
 * CSS の astronaut2Approach と同期するタイミング定数
 * - APPROACH_DELAY_MS … animation-delay（光る演出のあと宇宙人が動き出すまで）
 * - APPROACH_DURATION_MS … animation-duration
 * - EXIT_START_RATIO … 右へ退場し始める位置（フロー開始から約28s ≒ 87%）
 */
const APPROACH_DELAY_MS = 1150;
const APPROACH_DURATION_MS = 31000;
const EXIT_START_RATIO = 0.87;

/**
 * 退場中に「画面の何割以上が見えなくなったら終了とみなすか」
 * 0.8 → 見えている面積が 20% 以下になったら finishFlow（フェードは使わず移動で消す）
 */
const OFFSCREEN_AREA_RATIO = 0.8;

/**
 * astronaut2.png のシーケンス演出。
 * 暗転 → 空のキラッと光る → 宇宙人が近づいて拡大 → 約28sで右へ退場して画面外へ。
 * 終了時に onComplete を呼び、次のコレクション／フローへ進める。
 */
export default function Astronaut2Flow({ onComplete }) {
    // createPortal 用（SSR／初回描画では body が無いのでマウント後に portal）
    const [mounted, setMounted] = useState(false);
    // 終了後は CSS で非表示（astronaut2-flow--ended）
    const [ended, setEnded] = useState(false);
    // 退場判定・IntersectionObserver 用
    const imgRef = useRef(null);
    // タイマーと Observer の両方から finishFlow が二重に走らないようにする
    const completedRef = useRef(false);

    /** 演出終了処理（親へ完了通知・レイヤーを隠す） */
    const finishFlow = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        setEnded(true);
        onComplete?.();
    }, [onComplete]);

    // クライアントでマウント完了後に portal を有効化
    useEffect(() => {
        setMounted(true);
    }, []);

    // 最大尺に達したら必ず終了（画面外検知が間に合わない場合のフォールバック）
    useEffect(() => {
        const timer = setTimeout(finishFlow, FLOW_DURATION_MS);
        return () => clearTimeout(timer);
    }, [finishFlow]);

    /**
     * 右退場フェーズ以降、宇宙人が十分画面外に出たら早めに finishFlow する。
     * CSS の 87% キーフレーム（約28s）と EXIT_START_RATIO を揃えている。
     */
    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        let exitPhase = false;
        const exitEnableTimer = setTimeout(() => {
            exitPhase = true;
        }, APPROACH_DELAY_MS + APPROACH_DURATION_MS * EXIT_START_RATIO);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!exitPhase || completedRef.current) return;
                const visibleRatio = entry.intersectionRatio;
                if (visibleRatio <= 1 - OFFSCREEN_AREA_RATIO) {
                    finishFlow();
                }
            },
            { threshold: [0, 0.1, 0.2, 0.25, 0.5, 0.75, 1] }
        );

        observer.observe(img);

        return () => {
            clearTimeout(exitEnableTimer);
            observer.disconnect();
        };
    }, [mounted, finishFlow]);

    // 壁紙の DOM 階層の外（body 直下）に重ねて表示
    const flow = (
        <div
            className={`astronaut2-flow${ended ? " astronaut2-flow--ended" : ""}`}
        >
            {/* ① 画面全体を少し暗くする */}
            <div className="astronaut2-dark" aria-hidden="true" />
            {/* ② 空の右上がキラッと光る */}
            <div className="astronaut2-sparkle" aria-hidden="true" />
            {/* ③④ 宇宙人の接近・拡大・右退場（アニメは CSS） */}
            <div className="astronaut2-stage">
                <div className="astronaut2-sway">
                    <img
                        ref={imgRef}
                        src={`${publicUrl}/assets/ocean_image/collections/astronaut2.png`}
                        alt="astronaut2"
                        className="astronaut2-image"
                    />
                </div>
            </div>
        </div>
    );

    if (!mounted) return null;

    return createPortal(flow, document.body);
}
