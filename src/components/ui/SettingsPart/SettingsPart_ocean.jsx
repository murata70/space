import React from "react";
import "./SettingsPart_ocean.css";

const SettingsPart_ocean = ({
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
            {/* Sec */}
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

            {/* 24h */}
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

            {/* Timezone */}
            <div className="settings-row timezone-row">
                <span className="timezone-label">Time Zone</span>

                <select value={tz} onChange={(e) => setTz(e.target.value)}>
                    <option value="Asia/Tokyo">Japan / Osaka</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York</option>
                    <option value="America/Chicago">Chicago</option>
                    <option value="America/Denver">Denver</option>
                    <option value="America/Los_Angeles">Los Angeles</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Europe/Berlin">Berlin</option>
                    <option value="Asia/Seoul">Seoul</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                    <option value="Asia/Singapore">Singapore</option>
                    <option value="Australia/Sydney">Sydney</option>
                    <option value="Pacific/Honolulu">Hawaii</option>
                </select>
            </div>
        </>
    );
};

export default SettingsPart_ocean;