import { useLocation } from "react-router-dom";
import SpaceBackgroundStage from "../ui/background_space/SpaceBackgroundStage";
import FlowController from "../ui/flows/FlowController";
import Rocket from "../ui/Rocket/Rocket";
import PrimaryMonitorBackdrop from "../layout/PrimaryMonitorBackdrop";
import { SPACE_THEME_ROUTES } from "../../constants/wallpaperRoutes";

/** 宇宙テーマの壁紙背景（壁紙・設定・コレクションで共通・状態を維持） */
export default function SpaceWallpaperBackdrop() {
    const { pathname } = useLocation();
    const showRocket = SPACE_THEME_ROUTES.has(pathname);

    return (
        <PrimaryMonitorBackdrop>
            <div className="wallpaper-backdrop wallpaper-backdrop--space">
                <SpaceBackgroundStage>
                    <FlowController />
                </SpaceBackgroundStage>
                {showRocket ? (
                    <div className="space-rocket-layer">
                        <Rocket />
                    </div>
                ) : null}
            </div>
        </PrimaryMonitorBackdrop>
    );
}
