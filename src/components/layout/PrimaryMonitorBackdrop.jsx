import { usePrimaryDisplayLayout } from "../../hooks/usePrimaryDisplayLayout";
import "../../styles/primary-monitor-ui.css";

/**
 * 設定・コレクション時: 壁紙背景をメインモニター矩形に描画（壁紙は解除しない）
 */
export default function PrimaryMonitorBackdrop({ children }) {
    const backdropLayoutRef = usePrimaryDisplayLayout();

    return (
        <div className="wallpaper-backdrop-shell" aria-hidden>
            <div
                className="primary-monitor-ui primary-monitor-ui--backdrop"
                ref={backdropLayoutRef}
            >
                <div className="wallpaper-backdrop wallpaper-backdrop--primary">
                    {children}
                </div>
            </div>
        </div>
    );
}
