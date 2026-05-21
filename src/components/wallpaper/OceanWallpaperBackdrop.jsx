import OceanBackgroundStage from "../ocean_ui/OceanBackgroundStage";
import OceanFlowController from "../ocean_ui/flows/OceanFlowController";
import PrimaryMonitorBackdrop from "../layout/PrimaryMonitorBackdrop";

/** 海テーマの壁紙背景（メインモニター内・設定・コレクションの背後用） */
export default function OceanWallpaperBackdrop() {
    return (
        <PrimaryMonitorBackdrop>
            <div className="wallpaper-backdrop wallpaper-backdrop--ocean">
                <OceanBackgroundStage>
                    <OceanFlowController />
                </OceanBackgroundStage>
            </div>
        </PrimaryMonitorBackdrop>
    );
}
