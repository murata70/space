/** user_settings の launchOnStartup を読む（未設定時は true） */
export function readLaunchOnStartupSetting(savedSettings = {}) {
    if (typeof savedSettings.launchOnStartup === "boolean") {
        return savedSettings.launchOnStartup;
    }
    return true;
}

export async function applyLaunchOnStartup(enabled) {
    if (typeof window.electron?.setLaunchOnStartup !== "function") return;
    try {
        await window.electron.setLaunchOnStartup(enabled);
    } catch (error) {
        console.error("起動時自動起動の設定に失敗しました", error);
    }
}

export function loadUserSettings() {
    try {
        return JSON.parse(localStorage.getItem("user_settings") || "{}") || {};
    } catch {
        return {};
    }
}

export function saveUserSettings(settings) {
    localStorage.setItem("user_settings", JSON.stringify(settings));
}
