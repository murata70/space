import React from "react";
import "./Background.css"; // ‚±‚±‚ð BackgroundImg.css ‚©‚ç Background.css ‚ÉC³

const Background = () => {
    const publicUrl = process.env.PUBLIC_URL || "";

    const bgStyles = {
        "--bg-16x9": `url('${publicUrl}/assets/image/BackGround/background_16x9.png')`,
        "--bg-4x3": `url('${publicUrl}/assets/image/BackGround/background_4x3.png')`,
    };

    return <div className="background-container" style={bgStyles} />;
};

export default Background;