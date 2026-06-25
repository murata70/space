import { useEffect, useRef } from "react";
import { getPassingCarClassName } from "./passingCarProfiles";
import {
    OCEAN_ROAD1_SCROLL_DURATION_MS,
    PASSING_ROAD_DRIFT_OFFSET_RATIO,
} from "./passingRoadSync";
import "./PassingVehicle.css";

const PASS_MOVE_DURATION_MS = 12_000;

function readTranslateX(element) {
    const transform = getComputedStyle(element).transform;
    if (!transform || transform === "none") {
        return 0;
    }
    return new DOMMatrix(transform).m41;
}

function readOffscreenGapPx(layer) {
    const raw = getComputedStyle(layer)
        .getPropertyValue("--ocean-passing-offscreen-gap")
        .trim();
    const parsed = parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : 24;
}

function applyRoadDriftOffset(element) {
    const parent = element.offsetParent ?? element.parentElement;
    if (!parent) return;

    const topPx = parseFloat(getComputedStyle(element).top);
    if (!Number.isFinite(topPx)) return;

    const driftPx = parent.clientHeight * PASSING_ROAD_DRIFT_OFFSET_RATIO;
    element.style.transition = "top 0.4s ease-out";
    element.style.top = `${topPx + driftPx}px`;
}

function startRoadSyncMovement(element, layer, onComplete) {
    const viewportWidth = layer.clientWidth;
    const speedPxPerMs = viewportWidth / OCEAN_ROAD1_SCROLL_DURATION_MS;
    const gap = readOffscreenGapPx(layer);
    const layerLeft = layer.getBoundingClientRect().left;

    const startX = readTranslateX(element);
    element.style.animation = "none";
    element.style.marginTop = "0";
    element.style.transform = `translateX(${startX}px)`;
    element.classList.add("passing-car--road-sync");

    let lastTime = performance.now();
    let rafId = 0;
    let completed = false;

    const finish = () => {
        if (completed) return;
        completed = true;
        cancelAnimationFrame(rafId);
        onComplete?.();
    };

    const frame = (now) => {
        const dt = now - lastTime;
        lastTime = now;

        const currentX = readTranslateX(element);
        const nextX = currentX - speedPxPerMs * dt;
        element.style.transform = `translateX(${nextX}px)`;

        const carRight = element.getBoundingClientRect().right;
        if (carRight < layerLeft - gap) {
            finish();
            return;
        }

        rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
        completed = true;
        cancelAnimationFrame(rafId);
    };
}

export default function PassingVehicle({
    image,
    size = "default",
    position = null,
    roadSyncDelayMs = null,
    onComplete,
}) {
    const imgRef = useRef(null);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        const element = imgRef.current;
        if (!element) return undefined;

        const layer = element.parentElement;
        if (!layer) return undefined;

        let cancelled = false;
        let stopRoadSync = null;
        let driftTimerId = null;

        const complete = () => {
            if (cancelled) return;
            onCompleteRef.current?.();
        };

        const onMoveEnd = (event) => {
            if (event.animationName !== "passing-car-move") return;
            if (roadSyncDelayMs != null) return;
            element.removeEventListener("animationend", onMoveEnd);
            complete();
        };

        element.addEventListener("animationend", onMoveEnd);

        if (roadSyncDelayMs != null) {
            driftTimerId = window.setTimeout(() => {
                if (cancelled) return;

                applyRoadDriftOffset(element);
                stopRoadSync = startRoadSyncMovement(element, layer, () => {
                    element.removeEventListener("animationend", onMoveEnd);
                    complete();
                });
            }, roadSyncDelayMs);
        }

        const fallbackTimerId = window.setTimeout(() => {
            if (cancelled || roadSyncDelayMs != null) return;
            element.removeEventListener("animationend", onMoveEnd);
            complete();
        }, PASS_MOVE_DURATION_MS + 500);

        return () => {
            cancelled = true;
            clearTimeout(driftTimerId);
            clearTimeout(fallbackTimerId);
            element.removeEventListener("animationend", onMoveEnd);
            stopRoadSync?.();
        };
    }, [roadSyncDelayMs]);

    if (!image) return null;

    return (
        <img
            ref={imgRef}
            src={image}
            className={getPassingCarClassName(size, position)}
            alt="passing car"
            draggable="false"
        />
    );
}
