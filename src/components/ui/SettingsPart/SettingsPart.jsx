/* ===== SettingsPart.jsx ===== */

import React from "react";

import "./SettingsPart.css";

const SettingsPart = ({
    muted,
    setMuted,
    volume,
    setVolume,
    sec,
    setSec,
    is24h,
    setIs24h,
    tz,
    setTz
}) => {

    return (
        <>
            {/* 各行設定 */}
            {/* 音量 */}
            <div className="settings-row">
                <button
                    className="muteBtn"
                    onClick={() => {

                        if (muted || volume === 0) {
                            setMuted(false);
                            setVolume(50);
                        } else {
                            setMuted(true);
                            setVolume(0);
                        }
                    }}
                >
                    {muted || volume === 0 ? "🔇" : "🔊"}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {

                        const newVolume = Number(e.target.value);

                        setVolume(newVolume);

                        if (newVolume === 0) {
                            setMuted(true);
                        } else {
                            setMuted(false);
                        }
                    }}
                />
            </div>

            {/* sec */}
            <div className="settings-row">
                <span>Sec</span>

                <div className="text-toggle">
                    <button
                        className={sec ? "text-btn active" : "text-btn"}
                        onClick={() => setSec(true)}
                    >
                        ON
                    </button>

                    <button
                        className={!sec ? "text-btn active" : "text-btn"}
                        onClick={() => setSec(false)}
                    >
                        OFF
                    </button>
                </div>
            </div>


            {/* 24時間表示 */}
            <div className="settings-row">
                <span>24h</span>

                <div className="text-toggle">
                    <button
                        className={is24h ? "text-btn active" : "text-btn"}
                        onClick={() => setIs24h(true)}
                    >
                        ON
                    </button>

                    <button
                        className={!is24h ? "text-btn active" : "text-btn"}
                        onClick={() => setIs24h(false)}
                    >
                        OFF
                    </button>
                </div>

            </div>

            {/* タイムゾーン */}
            <div className="settings-row" style={{ display: "block" }}>
                <span style={{ display: "block", marginBottom: "5px" }}
                >
                    Time Zone</span>

                <select value={tz} onChange={(e) => setTz(e.target.value)}>
                    <option value="Asia/Tokyo">Japan / Osaka</option>
                    {/*<option value="Asia/Tokyo">Japan / Tokyo</option>*/}
                    <option value="UTC">UTC</option>

                    <option value="America/New_York">USA / New York</option>
                    <option value="America/Chicago">USA / Chicago</option>
                    <option value="America/Denver">USA / Denver</option>
                    <option value="America/Los_Angeles">USA / Los Angeles</option>

                    <option value="Europe/London">UK / London</option>
                    <option value="Europe/Paris">France / Paris</option>
                    <option value="Europe/Berlin">Germany / Berlin</option>

                    <option value="Asia/Seoul">Korea / Seoul</option>
                    <option value="Asia/Shanghai">China / Shanghai</option>
                    <option value="Asia/Singapore">Singapore</option>

                    <option value="Australia/Sydney">Australia / Sydney</option>

                    <option value="Pacific/Honolulu">Hawaii</option>


                </select>
            </div>
        </>
    );
};

export default SettingsPart;