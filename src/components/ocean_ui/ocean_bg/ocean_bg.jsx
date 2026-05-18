import React from "react";
import "./ocean_bg.css";

const OceanBg = () => {
    const isDev = window.location.hostname === "localhost";

    const publicUrl = isDev
        ? ""
        : window.location.origin +
        window.location.pathname.replace("index.html", "");

    return (
        <div className="ocean-road-wrapper">
            {/* road1 */}

            <div className="road-layer road1">
                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}assets/ocean_image/BackGround/background_road1.png')`,
                    }}
                />

                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}assets/ocean_image/BackGround/background_road1.png')`,
                    }}
                />
            </div>

            {/* road2 */}

            <div className="road-layer road2">
                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}assets/ocean_image/BackGround/background_road2.png')`,
                    }}
                />

                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}assets/ocean_image/BackGround/background_road2.png')`,
                    }}
                />
            </div>
        </div>
    );
};

export default OceanBg;