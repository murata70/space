import React from "react";
import "./ocean_bg.css";

const OceanBg = () => {

    const publicUrl = process.env.PUBLIC_URL || "";

    return (
        <div className="ocean-road-wrapper">

            {/* road1 */}
            <div className="road-layer road1">

                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}/assets/ocean_image/BackGround/background_road1.png')`,
                    }}
                />

                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}/assets/ocean_image/BackGround/background_road1.png')`,
                    }}
                />

            </div>

            {/* road2 */}
            <div className="road-layer road2">

                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}/assets/ocean_image/BackGround/background_road2.png')`,
                    }}
                />

                <div
                    className="road-track"
                    style={{
                        backgroundImage: `url('${publicUrl}/assets/ocean_image/BackGround/background_road2.png')`,
                    }}
                />

            </div>
        </div>
    );
};

export default OceanBg;