import React from 'react';
import { ChannelState } from '../types';

interface MixerProps {
    crossfader: number;
    setCrossfader: (val: number) => void;
    channels: [ChannelState, ChannelState, ChannelState, ChannelState];
    setChannelState: (index: number, state: Partial<ChannelState>) => void;
}

const Mixer: React.FC<MixerProps> = ({ crossfader, setCrossfader, channels, setChannelState }) => {

    const renderChannel = (index: number) => {
        // Channel Mapping:
        // 0: Deck A Audio
        // 1: Deck A Video
        // 2: Deck B Audio
        // 3: Deck B Video
        const isVideo = index === 1 || index === 3;
        const deckLabel = index < 2 ? 'DECK A' : 'DECK B';
        const typeLabel = isVideo ? 'VIDEO' : 'AUDIO';

        return (
            <div key={index} className="flex flex-col items-center gap-4 p-2 bg-gray-900 rounded-lg min-w-[60px]">
                <div className="text-center mb-2">
                    <div className="text-[10px] text-gray-500 font-bold">{deckLabel}</div>
                    <div className={`text-[10px] font-bold ${isVideo ? 'text-blue-400' : 'text-purple-400'}`}>{typeLabel}</div>
                </div>

                {/* EQs (Only for Audio channels usually, but maybe color correction for video later? For now, keep EQs for all or just audio?)
                    User asked for "4 channel mixer". If we treat video as a signal, we can have "EQ"s be RGB?
                    For MVP simplicity, let's render standard EQs for all, but maybe disable/hide for video to save space or re-purpose.
                    Let's keep High/Mid/Low for all for consistency, maybe High=Brightness, Mid=Contrast?
                    Let's just label them H/M/L.
                */}
                {['high', 'mid', 'low'].map((band) => (
                    <div key={band} className="flex flex-col items-center">
                        <div className="h-16 w-6 flex items-center justify-center">
                            <input
                                type="range"
                                min="-12"
                                max="12"
                                value={channels[index][band as keyof ChannelState]}
                                onChange={(e) => setChannelState(index, { [band]: parseFloat(e.target.value) })}
                                className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer -rotate-90 origin-center"
                            />
                        </div>
                    </div>
                ))}

                {/* Volume/Opacity Fader */}
                <div className="mt-2 flex flex-col items-center h-32 justify-end">
                    <div className="h-24 w-8 flex items-center justify-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={channels[index].volume}
                            onChange={(e) => setChannelState(index, { volume: parseFloat(e.target.value) })}
                            className="w-24 h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer -rotate-90 origin-center"
                        />
                    </div>
                    <span className="text-[10px] mt-1 text-gray-500">{isVideo ? 'OPAC' : 'VOL'}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 w-full max-w-2xl">
            <div className="flex justify-between gap-2 md:gap-4 overflow-x-auto">
                <div className="flex gap-2">
                    {renderChannel(0)} {/* A Audio */}
                    {renderChannel(1)} {/* A Video */}
                </div>

                {/* Master / Crossfader Section */}
                <div className="flex flex-col justify-between items-center w-24 shrink-0">
                    <div className="h-full flex flex-col justify-center items-center">
                        <div className="text-center text-gray-500 text-xs mb-2">MASTER</div>
                        <div className="h-32 w-4 bg-gray-900 rounded border border-gray-700 relative overflow-hidden">
                            {/* Fake VU Meter */}
                            <div className="absolute bottom-0 w-full bg-green-500 h-2/3 opacity-50"></div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {renderChannel(2)} {/* B Audio */}
                    {renderChannel(3)} {/* B Video */}
                </div>
            </div>

            {/* Crossfader */}
            <div className="mt-6 px-8">
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
                    className="w-full h-6 bg-gray-900 rounded-full appearance-none cursor-pointer border border-gray-700"
                />
            </div>
        </div>
    );
};

export default Mixer;
