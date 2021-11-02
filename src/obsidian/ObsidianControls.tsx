
import React, { useState } from 'react';

export default function ObsidianControls() {
    const [enabled, setEnabled] = useState(false);
    return (
        <div className="sekund">
            <div className="flex flex-col justify-center flex-start">
                <div className="flex flex-col space-y-2 flex-start">
                    <button className="self-start">Button</button>
                    <button className="self-start mod-cta">Button</button>
                    <div onClick={() => setEnabled(!enabled)} className={`checkbox-container ${enabled ? 'is-enabled' : ''}`} ></div>
                    <select className="self-start dropdown">
                        <option value="sideway">Sideway</option>
                        <option value="mixed">Mixed</option>
                        <option value="upright">Upright</option>
                    </select>
                </div>
            </div>
        </div>
    );
}