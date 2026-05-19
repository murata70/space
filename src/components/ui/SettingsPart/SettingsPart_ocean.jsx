import React from "react";
import "./SettingsPart_ocean.css";

const SettingsPart_ocean = ({
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
                        const v = Number(e.target.value);
                        setVolume(v);
                        setMuted(v === 0);
                    }}
                />
            </div>

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