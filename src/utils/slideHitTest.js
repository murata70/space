export function isPointInRect(x, y, rect) {
    if (!rect) return false;
    return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
    );
}

/** --slide-panel-width の実寸（px） */
export function measureSlidePanelWidth(slideAreaEl) {
    if (!slideAreaEl) return 220;

    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
        "position:absolute;visibility:hidden;pointer-events:none;width:var(--slide-panel-width);height:1px;";
    slideAreaEl.appendChild(probe);
    const width = probe.getBoundingClientRect().width;
    slideAreaEl.removeChild(probe);

    return width > 0 ? width : 220;
}

/**
 * 開いたときの維持ゾーン幅（コレクション幅に対する比率 0〜1）
 * --slide-hover-zone-ratio（例: 0.34 = 右から約34%）
 */
export function measureSlideHoverZoneRatio(slideAreaEl) {
    if (!slideAreaEl) return 0.34;

    const raw = getComputedStyle(slideAreaEl)
        .getPropertyValue("--slide-hover-zone-ratio")
        .trim();
    const parsed = parseFloat(raw);

    if (Number.isFinite(parsed) && parsed > 0 && parsed <= 1) {
        return parsed;
    }

    return 0.34;
}

/** THEMES タブのみの当たり判定矩形（開くトリガー） */
export function getSlideTabHitRect(slideAreaEl) {
    if (!slideAreaEl) return null;

    const tab = slideAreaEl.querySelector(".slide-tab");
    if (!tab) return slideAreaEl.getBoundingClientRect();

    return tab.getBoundingClientRect();
}

/**
 * 開いたときの維持ゾーン（赤枠相当）
 * コレクションウィンドウ右端から左へ一定幅・上下いっぱい
 */
export function getSlideExpandedHitRect(slideAreaEl) {
    if (!slideAreaEl) return null;

    const tab = slideAreaEl.querySelector(".slide-tab");
    if (!tab) return slideAreaEl.getBoundingClientRect();

    const host = slideAreaEl.closest(".collection-wrap");
    if (host) {
        const hostRect = host.getBoundingClientRect();
        const ratio = measureSlideHoverZoneRatio(slideAreaEl);
        const zoneWidth = hostRect.width * ratio;

        return {
            left: hostRect.right - zoneWidth,
            right: hostRect.right,
            top: hostRect.top,
            bottom: hostRect.bottom,
        };
    }

    const tabRect = tab.getBoundingClientRect();
    const panelWidth = measureSlidePanelWidth(slideAreaEl);

    return {
        left: tabRect.left - panelWidth,
        right: tabRect.right,
        top: tabRect.top,
        bottom: tabRect.bottom,
    };
}

/** 閉: THEMES タブ / 開: 維持ゾーン全体 */
export function getSlideInteractiveHitRect(slideAreaEl, isOpen) {
    if (!slideAreaEl) return null;

    const open =
        typeof isOpen === "boolean"
            ? isOpen
            : slideAreaEl.classList.contains("is-hovered");

    if (open) {
        return getSlideExpandedHitRect(slideAreaEl);
    }

    return getSlideTabHitRect(slideAreaEl);
}

/** 閉: THEMES タブ上で開く / 開: 維持ゾーン上で維持 */
export function isPointOverSlideHoverZone(slideAreaEl, clientX, clientY) {
    const rect = getSlideInteractiveHitRect(slideAreaEl);
    return rect ? isPointInRect(clientX, clientY, rect) : false;
}

/** 座標が THEMES 維持ゾーン内か（開閉状態を明示） */
export function isPointOverSlideZone(slideAreaEl, clientX, clientY, isOpen) {
    const rect = getSlideInteractiveHitRect(slideAreaEl, isOpen);
    return rect ? isPointInRect(clientX, clientY, rect) : false;
}
