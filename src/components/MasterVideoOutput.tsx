import React from 'react';
import { ChannelState } from '../types';

interface MasterVideoOutputProps {
    channels: [ChannelState, ChannelState, ChannelState, ChannelState];
    deckAVideo?: string;
    deckBVideo?: string;
    drumVideoClip?: string | null;
}

const MasterVideoOutput: React.FC<MasterVideoOutputProps> = ({ channels, deckAVideo, deckBVideo, drumVideoClip }) => {
    // Helper to generate CSS filter string based on EQ knobs
    // Knobs are -12 to +12.
    // High (Chroma): hue-rotate (deg), saturate (%)
    // Mid (Luma): contrast (%), brightness (%)
    // Low (Opacity): trim 0-1
    const getFilterStyle = (high: number, mid: number, _low: number) => {
        // High (Chroma): Map -12..12 to Hue Rotate -180..180 deg
        const hueRotate = high * 15; // 12 * 15 = 180
        // High also affects Saturation: -12 -> 0%, 0 -> 100%, 12 -> 200%
        const saturate = Math.max(0, 1 + (high / 12));

        // Mid (Luma): Map -12..12 to Contrast 0..200%
        const contrast = Math.max(0, 1 + (mid / 12));
        // Mid also affects Brightness slightly to help keying: -12 -> 50%, 12 -> 150%
        const brightness = Math.max(0, 1 + (mid / 24));

        return `hue-rotate(${hueRotate}deg) saturate(${saturate}) contrast(${contrast}) brightness(${brightness})`;
    };

    const getOpacity = (baseOpacity: number, low: number) => {
        // Low knob trims opacity. -12 kills it, 0 is neutral, +12 boosts (clamped 1)
        // Map -12..12 to multiplier 0..2? Or just linear trim.
        // Let's say Low=-12 => 0 opacity. Low=0 => baseOpacity.
        const trim = Math.max(0, 1 + (low / 12));
        return Math.min(1, baseOpacity * trim);
    };

    const getBlendMode = (mid: number): React.CSSProperties['mixBlendMode'] => {
        // If Luma (Mid) is cranked high (> 6), switch to Screen to burn highlights
        if (mid > 6) return 'screen';
        // If Luma is very low (< -6), maybe Multiply?
        if (mid < -6) return 'multiply';
        return 'normal';
    };

    // Channel 1 = Deck A Video
    // Channel 3 = Deck B Video
    const chA = channels[1];
    const chB = channels[3];

    const styleA = {
        opacity: getOpacity(chA.volume, chA.low),
        filter: getFilterStyle(chA.high, chA.mid, chA.low),
        mixBlendMode: getBlendMode(chA.mid)
    };

    const styleB = {
        opacity: getOpacity(chB.volume, chB.low),
        filter: getFilterStyle(chB.high, chB.mid, chB.low),
        mixBlendMode: 'screen' // Deck B is usually overlaid, default to screen/blend or just normal opacity?
                               // Previous code forced 'mix-blend-screen'. Let's make it dynamic or keep it if 'normal' blocks A.
                               // If normal, it just covers A. Usually VJ mixing uses Add/Screen.
                               // Let's use the dynamic blend mode unless default behavior is preferred.
                               // User asked for "Luma keys" which implies blend modes.
                               // Let's let the Mid knob control it as planned.
                               // BUT, if we want standard opacity mixing, we need 'normal'.
                               // Let's default B to 'normal' unless Mid is pushed.
        // Actually, if Deck B is normal opacity, it hides Deck A completely if Opacity=1.
        // The user's prompt implies specialized keying.
        // Let's stick to the dynamic blend mode from getBlendMode, but if it's 'normal', it's just alpha blending.
    };

    // Override Deck B default blend to match Deck A logic for consistency,
    // OR keep the previous 'mix-blend-screen' as a base if desired?
    // Let's apply dynamic logic. If Mid is 0, it's Normal alpha blend.
    const blendB = getBlendMode(chB.mid);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            {/* Deck A Layer */}
            {deckAVideo && (
                <div
                    className="absolute inset-0 w-full h-full transition-all duration-100"
                    style={styleA}
                >
                    <video
                        src={deckAVideo}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Deck B Layer */}
            {deckBVideo && (
                <div
                    className="absolute inset-0 w-full h-full transition-all duration-100"
                    style={{ ...styleB, mixBlendMode: blendB === 'normal' && chB.mid > 0 ? 'screen' : blendB }}
                    // Slight heuristic: If Luma is tweaked at all positive, favor screen for B to allow A to show through better?
                    // Or just strict logic. Strict logic is cleaner.
                >
                    <video
                        src={deckBVideo}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Drum Video Clip Overlay - Flashes on top */}
            {drumVideoClip && (
                <div className="absolute inset-0 w-full h-full z-20 mix-blend-lighten flex items-center justify-center">
                    <video
                        key={drumVideoClip}
                        src={drumVideoClip}
                        autoPlay
                        muted
                        onEnded={(e) => (e.target as HTMLVideoElement).style.opacity = '0'}
                        className="w-full h-full object-cover animate-pulse-fast"
                    />
                </div>
            )}

            {/* Fallback */}
            {(!deckAVideo && !deckBVideo && !drumVideoClip) && (
                <div className="flex items-center justify-center h-full opacity-10">
                    <span className="text-6xl font-bold text-gray-800">MASTER OUTPUT</span>
                </div>
            )}
        </div>
    );
};

export default MasterVideoOutput;
