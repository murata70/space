import { useLocation } from "react-router-dom";
import OceanBackgroundStage from "../ocean_ui/OceanBackgroundStage";
import OceanFlowController from "../ocean_ui/flows/OceanFlowController";
import PrimaryMonitorBackdrop from "../layout/PrimaryMonitorBackdrop";
import { OCEAN_THEME_ROUTES } from "../../constants/wallpaperRoutes";

/** 海テーマの壁紙背景（壁紙・設定・コレクションで共通・状態を維持） */
export default function OceanWallpaperBackdrop() {
    const { pathname } = useLocation();
    const showMainCar = OCEAN_THEME_ROUTES.has(pathname);

    return (
        <PrimaryMonitorBackdrop>
            <div className="wallpaper-backdrop wallpaper-backdrop--ocean">
                <OceanBackgroundStage showMainCar={showMainCar}>
                    <OceanFlowController />
                </OceanBackgroundStage>
            </div>
        </PrimaryMonitorBackdrop>
    );
}
