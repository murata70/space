import React from "react";
import "./BackGround.css";

const BackGround = () => {
    // 開発環境(localhost)と本番環境(file://)のどちらでも動作するベースパスを取得
    const isDev = window.location.hostname === "localhost";
    const publicUrl = isDev ? "" : window.location.origin + window.location.pathname.replace("index.html", "");

    const bgStyles = {
        /* url() の中に正しいパスを注入 */
        "--bg-16x9": `url('${publicUrl}assets/image/BackGround/background_16x9.png')`,
        "--bg-4x3": `url('${publicUrl}assets/image/BackGround/background_4x3.png')`,
    };

    return <div className="background-container" style={bgStyles} />;
};

export default BackGround;