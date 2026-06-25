/** passing 番号ごとのサイズ・縦位置 */
export const PASSING_CAR_PROFILES = {
    1: { size: "sm", position: "lower-more" },
    2: { size: "large", position: "higher" },
    3: { size: "default", position: "lower" },
    4: { size: "large-lg-sm", position: "higher" },
    5: { size: "large-sm", position: null },
    6: { size: "default", position: "lower" },
    7: { size: "md", position: "lower" },
    8: { size: "sm", position: "lower-more" },
    9: { size: "sm", position: "lower-more" },
    10: { size: "large-sm", position: null },
    11: { size: "large-lg", position: "higher" },
    12: { size: "large-xl", position: "higher-most" },
    13: { size: "large", position: "higher" },
};

export function getPassingCarClassName(size = "default", position = null) {
    const classes = ["passing-car"];
    if (size && size !== "default") {
        classes.push(`passing-car--${size}`);
    }
    if (position) {
        classes.push(`passing-car--${position}`);
    }
    return classes.join(" ");
}
