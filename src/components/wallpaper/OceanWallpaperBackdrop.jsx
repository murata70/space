import BackGroundOcean from "../ocean_ui/background_ocean/BackGround";
import OceanBg from "../ocean_ui/ocean_bg/ocean_bg";
import OceanFlowController from "../ocean_ui/flows/OceanFlowController";
import PrimaryMonitorBackdrop from "../layout/PrimaryMonitorBackdrop";

/** 海テーマの壁紙背景（メインモニター内・設定・コレクションの背後用） */
export default function OceanWallpaperBackdrop({ baseUrl }) {
    return (
        <PrimaryMonitorBackdrop>
            <div className="wallpaper-backdrop wallpaper-backdrop--ocean">
                <BackGroundOcean baseUrl={baseUrl} />
                <OceanBg baseUrl={baseUrl} />
                <OceanFlowController />
            </div>
        </PrimaryMonitorBackdrop>
    );
}
