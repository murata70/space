import React from "react";
import "./BackGround.css";

const publicUrl = process.env.PUBLIC_URL || "";

const BackGroundOcean = () => {

    const bgStyles = {
        "--ocean-bg": `url('${publicUrl}/assets/ocean_image/background_ocean/background_ocean.png')`,
    };

    return (
        <div
            className="ocean-background-container"
            style={bgStyles}
        />
    );
};

export default BackGroundOcean;