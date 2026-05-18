import React from "react";
import "./BackGround.css";

const BackGroundOcean = () => {
    const isDev = window.location.hostname === "localhost";

    const publicUrl = isDev
        ? ""
        : window.location.origin +
        window.location.pathname.replace("index.html", "");

    const bgStyles = {
        "--ocean-bg": `url('${publicUrl}assets/ocean_image/BackGround/background_ocean.png')`,
    };

    return (
        <div
            className="ocean-background-container"
            style={bgStyles}
        />
    );
};

export default BackGroundOcean;