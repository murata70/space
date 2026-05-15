import React from "react";
import "./BackgroundImg.css";

const BackgroundImg = () => {
    // パスの起点となるURLを取得
    const publicUrl = (process.env.PUBLIC_URL || "").replace(/\/$/, "");

    const bgStyles = {
        "--bg-16x9": `url('${publicUrl}/assets/image/BackGround/background_16x9.png')`,
        "--bg-4x3": `url('${publicUrl}/assets/image/BackGround/background_4x3.png')`,
    };

    return <div className="background-image-container" style={bgStyles} />;
};

export default BackgroundImg;