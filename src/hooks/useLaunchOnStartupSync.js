import { useEffect } from "react";
import {
    applyLaunchOnStartup,
    loadUserSettings,
    readLaunchOnStartupSetting,
} from "../utils/launchOnStartup";

/** アプリ起動時に localStorage の設定を OS へ反映する */
export function useLaunchOnStartupSync() {
    useEffect(() => {
        const settings = loadUserSettings();
        applyLaunchOnStartup(readLaunchOnStartupSetting(settings));
    }, []);
}
