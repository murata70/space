import React from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
import Planets from "../../components/ui/Planets/Planets";
import Rocket from "../../components/ui/Rocket/Rocket";

// ★これを追加
import FlowingAssets from "../../components/ui/FlowingAssets/FlowingAssets";

const Wallpaper = () => {

  const navigate = useNavigate();

  return (
    <div className="wallpaper">

      {/* 星背景 */}
      <StarField />

      {/* 惑星 */}
      <Planets />

      {/* ★ここが重要（コレクション流す本体） */}
      <FlowingAssets />

      {/* ロケット */}
      <Rocket />

      {/* UI */}
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