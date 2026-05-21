import SpaceBackgroundStage from "../ui/background_space/SpaceBackgroundStage";
import FlowController from "../ui/flows/FlowController";
import PrimaryMonitorBackdrop from "../layout/PrimaryMonitorBackdrop";

/** 宇宙テーマの壁紙背景（メインモニター内・設定・コレクションの背後用） */
export default function SpaceWallpaperBackdrop() {
    return (
        <PrimaryMonitorBackdrop>
            <div className="wallpaper-backdrop wallpaper-backdrop--space">
                <SpaceBackgroundStage>
                    <FlowController />
                </SpaceBackgroundStage>
            </div>
        </PrimaryMonitorBackdrop>
    );
}
