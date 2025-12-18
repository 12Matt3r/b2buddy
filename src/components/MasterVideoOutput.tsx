import React from 'react';
import { ChannelState } from '../types';

interface MasterVideoOutputProps {
    channels: [ChannelState, ChannelState, ChannelState, ChannelState];
    deckAVideo?: string;
    deckBVideo?: string;
    drumVideoClip?: string | null; // New prop for active drum video overlay
}

const MasterVideoOutput: React.FC<MasterVideoOutputProps> = ({ channels, deckAVideo, deckBVideo, drumVideoClip }) => {
    // Channel 1 = Deck A Video
    // Channel 3 = Deck B Video
    const opacityA = channels[1].volume;
    const opacityB = channels[3].volume;

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            {/* Deck A Layer */}
            {deckAVideo && (
                <div
                    className="absolute inset-0 w-full h-full transition-opacity duration-100"
                    style={{ opacity: opacityA }}
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
                    className="absolute inset-0 w-full h-full transition-opacity duration-100 mix-blend-screen"
                    style={{ opacity: opacityB }}
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
                        key={drumVideoClip} // Force re-render/play on change
                        src={drumVideoClip}
                        autoPlay
                        muted
                        // No loop usually for hits, but maybe loop if held? For now assume one-shot.
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
