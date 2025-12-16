import React from 'react';

interface MixerProps {
    crossfader: number;
    setCrossfader: (val: number) => void;
    volumes: [number, number];
    setVolume: (deckIndex: number, val: number) => void;
    eqs: [{high: number, mid: number, low: number}, {high: number, mid: number, low: number}];
    setEQ: (deckIndex: number, band: 'high' | 'mid' | 'low', val: number) => void;
}

const Mixer: React.FC<MixerProps> = ({ crossfader, setCrossfader, volumes, setVolume, eqs, setEQ }) => {

    const renderChannel = (index: number) => (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-lg">
            <h3 className="text-gray-400 font-bold">CH {index + 1}</h3>

            {/* EQs */}
            {['high', 'mid', 'low'].map((band) => (
                <div key={band} className="flex flex-col items-center">
                    <span className="text-xs uppercase text-gray-500 mb-1">{band}</span>
                    <input
                        type="range"
                        min="-12"
                        max="12"
                        value={eqs[index][band as 'high'|'mid'|'low']}
                        onChange={(e) => setEQ(index, band as 'high'|'mid'|'low', parseFloat(e.target.value))}
                        className="h-24 w-2 bg-gray-700 rounded-lg appearance-none cursor-pointer vertical-range"
                        style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
                    />
                </div>
            ))}

            {/* Volume Fader */}
            <div className="mt-4 flex flex-col items-center h-48 justify-end">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumes[index]}
                    onChange={(e) => setVolume(index, parseFloat(e.target.value))}
                    className="h-32 w-4 bg-gray-700 rounded-lg appearance-none cursor-pointer vertical-range"
                    style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
                />
                <span className="text-xs mt-2">VOL</span>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="flex justify-center gap-8">
                {renderChannel(0)}

                {/* Master Section / Visuals could go here */}
                <div className="w-24 flex flex-col justify-center items-center">
                    <div className="text-center text-gray-500 text-xs mb-2">MASTER</div>
                    <div className="h-48 w-4 bg-gray-900 rounded border border-gray-700 relative overflow-hidden">
                        {/* Fake VU Meter */}
                        <div className="absolute bottom-0 w-full bg-green-500 h-2/3 opacity-50"></div>
                    </div>
                </div>

                {renderChannel(1)}
            </div>

            {/* Crossfader */}
            <div className="mt-8 px-8">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>A</span>
                    <span>CROSSFADER</span>
                    <span>B</span>
                </div>
                <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={crossfader}
                    onChange={(e) => setCrossfader(parseFloat(e.target.value))}
                    className="w-full h-4 bg-gray-900 rounded-full appearance-none cursor-pointer border border-gray-700"
                />
            </div>
        </div>
    );
};

export default Mixer;
