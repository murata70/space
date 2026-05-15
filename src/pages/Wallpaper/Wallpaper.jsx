import React from "react";
import { useNavigate } from "react-router-dom";
import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
import Planets from "../../components/ui/Planets/Planets";
import Rocket from "../../components/ui/Rocket/Rocket";
import FlowController from "../../components/ui/flows/FlowController";
import SpaceDust from "../../components/ui/SpaceDust/SpaceDust";

const Wallpaper = () => {
    const navigate = useNavigate();

    // パスの起点となるURLを取得（Electronの相対パス対応）
    const publicUrl = process.env.PUBLIC_URL || "";

    return (
        <div
            className="wallpaper"
            style={{
                /* CSS変数への適用 */
                "--bg-16x9": `url('${publicUrl}/assets/image/BackGround/background_16x9.png')`,
                "--bg-4x3": `url('${publicUrl}/assets/image/BackGround/background_4x3.png')`,
            }}
        >
            {/* 
               もしWallpaper.jsx内で直接画像を表示する場合は、
               以下のように img タグを記述します。
               <img src={`${publicUrl}/assets/image/test.png`} alt="test" />
            */}

            <StarField />
            <Planets />
            <SpaceDust />
            <FlowController />
            <Rocket />

            <div className="bottom-ui">
                <Clock />
                <button
                    className="icon-btn"
                    onClick={() => navigate("/collection")}
                >
                    📁
                </button>
                <button
                    className="icon-btn"
                    onClick={() => navigate("/settings")}
                >
                    ⚙️
                </button>
            </div>
        </div>
    );
};

export default Wallpaper;