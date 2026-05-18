import React from "react";
import "./BackGround.css";

const BackGroundOcean = () => {
    const publicUrl = process.env.PUBLIC_URL || "";

    const bgStyles = {
        "--ocean-bg": `url('${publicUrl}/assets/ocean_image/BackGround/background_ocean.png')`,
    };

    return (
        <div
            className="ocean-background-container"
            style={bgStyles}
        />
    );
};

export default BackGroundOcean;