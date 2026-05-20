import { useEffect } from "react";
import { usePrimaryDisplayLayout } from "../../../hooks/usePrimaryDisplayLayout";
import "./ThemeConfirmDialog.css";

export default function ThemeConfirmDialog({
    open,
    themeName = "",
    onConfirm,
    onCancel,
}) {
    const overlayLayoutRef = usePrimaryDisplayLayout();

    useEffect(() => {
        if (!open) return undefined;

        if (typeof window.electron?.setIgnoreMouse === "function") {
            window.electron.setIgnoreMouse(false);
        }

        const onKeyDown = (e) => {
            if (e.key === "Escape") onCancel?.();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            ref={overlayLayoutRef}
            className="theme-confirm-overlay"
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel?.();
            }}
        >
            <div
                className="theme-confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="theme-confirm-title"
            >
                <div className="theme-confirm-header">
                    <h3 id="theme-confirm-title" className="theme-confirm-title">
                        space
                    </h3>
                    <button
                        type="button"
                        className="theme-confirm-close"
                        aria-label="閉じる"
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>

                <p className="theme-confirm-body">
                    この壁紙（{themeName}）に設定しますか？
                </p>

                <div className="theme-confirm-actions">
                    <button
                        type="button"
                        className="theme-confirm-btn theme-confirm-btn--primary"
                        onClick={onConfirm}
                    >
                        OK
                    </button>
                    <button
                        type="button"
                        className="theme-confirm-btn"
                        onClick={onCancel}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
}
