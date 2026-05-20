import BackGround from "../ui/background_space/BackGround";
import StarField from "../ui/StarField/StarField";
import Planets from "../ui/Planets/Planets";
import SpaceDust from "../ui/SpaceDust/SpaceDust";
import FlowController from "../ui/flows/FlowController";
import PrimaryMonitorBackdrop from "../layout/PrimaryMonitorBackdrop";

/** 宇宙テーマの壁紙背景（メインモニター内・設定・コレクションの背後用） */
export default function SpaceWallpaperBackdrop() {
    return (
        <PrimaryMonitorBackdrop>
            <div className="wallpaper-backdrop wallpaper-backdrop--space">
                <BackGround />
                <StarField />
                <Planets />
                <SpaceDust />
                <FlowController />
            </div>
        </PrimaryMonitorBackdrop>
    );
}
