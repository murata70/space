import { useEffect, useRef } from "react";
import { usePrimaryDisplayLayout } from "../../../hooks/usePrimaryDisplayLayout";
import "./ThemeConfirmDialog.css";

export default function ThemeConfirmDialog({
    open,
    themeName = "",
    message,
    confirmLabel = "OK",
    cancelLabel = "キャンセル",
    showCancel = true,
    onConfirm,
    onCancel,
}) {
    const bodyText =
        message ?? `この壁紙（${themeName}）に設定しますか？`;
    const overlayLayoutRef = usePrimaryDisplayLayout();
    const actionLockRef = useRef(false);

    useEffect(() => {
        if (!open) return undefined;
        actionLockRef.current = false;

        const lockMouse = () => {
            window.electron?.setIgnoreMouse?.(false);
        };

        lockMouse();
        const lockTimer = setInterval(lockMouse, 32);

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                onCancel?.();
                return;
            }
            if (e.key === "Enter") {
                onConfirm?.();
            }
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            clearInterval(lockTimer);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onCancel, onConfirm]);

    const runOnce = (handler, event) => {
        event.preventDefault();
        event.stopPropagation();
        if (actionLockRef.current) return;
        actionLockRef.current = true;
        handler?.();
    };

    const handleConfirm = (event) => runOnce(onConfirm, event);
    const handleCancel = (event) => runOnce(onCancel, event);

    if (!open) return null;

    return (
        <div
            ref={overlayLayoutRef}
            className="theme-confirm-overlay"
            role="presentation"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel?.();
            }}
        >
            <div
                className="theme-confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="theme-confirm-title"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <div className="theme-confirm-header">
                    <h3 id="theme-confirm-title" className="theme-confirm-title">
                        space
                    </h3>
                    <button
                        type="button"
                        className="theme-confirm-close"
                        aria-label="閉じる"
                        onPointerDown={handleCancel}
                    >
                        ×
                    </button>
                </div>

                <p className="theme-confirm-body">{bodyText}</p>

                <div className="theme-confirm-actions">
                    <button
                        type="button"
                        className="theme-confirm-btn theme-confirm-btn--primary"
                        onPointerDown={handleConfirm}
                    >
                        {confirmLabel}
                    </button>
                    {showCancel ? (
                        <button
                            type="button"
                            className="theme-confirm-btn"
                            onPointerDown={handleCancel}
                        >
                            {cancelLabel}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
