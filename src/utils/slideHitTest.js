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

/** THEMES タブ＋左に伸びるパネル全体の当たり判定矩形 */
export function getSlideExpandedHitRect(slideAreaEl) {
    if (!slideAreaEl) return null;

    const tab = slideAreaEl.querySelector(".slide-tab");
    if (!tab) return slideAreaEl.getBoundingClientRect();

    const tabRect = tab.getBoundingClientRect();
    const panelWidth = measureSlidePanelWidth(slideAreaEl);

    return {
        left: tabRect.left - panelWidth,
        right: tabRect.right,
        top: tabRect.top,
        bottom: tabRect.bottom,
    };
}

export function isPointOverSlideHoverZone(slideAreaEl, clientX, clientY) {
    if (!slideAreaEl) return false;
    const rect = getSlideExpandedHitRect(slideAreaEl);
    return isPointInRect(clientX, clientY, rect);
}
