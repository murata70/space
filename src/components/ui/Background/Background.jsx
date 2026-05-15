import React from "react";
import "./Background.css";

const Background = () => {
    // アプリの実行場所を基準としたベースパスを取得
    const publicUrl = process.env.PUBLIC_URL || "";

    const bgStyles = {
        /* スラッシュを正規化し、正しい相対パスを構築 */
        "--bg-16x9": `url('${publicUrl}/assets/image/Background/background_16x9.png')`,
        "--bg-4x3": `url('${publicUrl}/assets/image/Background/background_4x3.png')`,
    };

    return <div className="background-container" style={bgStyles} />;
};

export default Background;