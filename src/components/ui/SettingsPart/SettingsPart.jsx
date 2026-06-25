/* ===== SettingsPart.jsx ===== */

import React from "react";

import "./SettingsPart.css";

const SettingsPart = ({
    sec,
    setSec,
    is24h,
    setIs24h,
    launchOnStartup,
    setLaunchOnStartup,
    tz,
    setTz
}) => {

    return (
        <>
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

            {/* PC起動時に自動起動 */}
            <div className="settings-row">
                <span className="settings-row-label--long">
                    PCの起動時にspaceを自動的に開く
                </span>

                <div className="text-toggle">
                    <button
                        className={launchOnStartup ? "text-btn active" : "text-btn"}
                        onClick={() => setLaunchOnStartup(true)}
                    >
                        ON
                    </button>

                    <button
                        className={!launchOnStartup ? "text-btn active" : "text-btn"}
                        onClick={() => setLaunchOnStartup(false)}
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