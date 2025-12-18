import React, { useRef, useEffect } from 'react';
import { ChannelState } from '../types';
import VJRenderer, { VJRendererRef } from './VJRenderer';

interface MasterVideoOutputProps {
    channels: [ChannelState, ChannelState, ChannelState, ChannelState];
    deckAVideo?: string;
    deckBVideo?: string;
    drumVideoClip?: string | null;
    activeEffect: 'datamosh' | 'pixelsort' | 'feedback' | 'colorshift' | 'none';
}

const MasterVideoOutput: React.FC<MasterVideoOutputProps> = ({ channels, deckAVideo, deckBVideo, drumVideoClip, activeEffect }) => {
    // Channel 1 = Deck A Video
    // Channel 3 = Deck B Video
    const chA = channels[1];
    const chB = channels[3];

    // Refs to invisible video elements for WebGL consumption
    const videoARef = useRef<HTMLVideoElement>(null);
    const videoBRef = useRef<HTMLVideoElement>(null);
    const rendererRef = useRef<VJRendererRef>(null);

    // Logic for Video Elements
    useEffect(() => {
        if (videoARef.current && deckAVideo) {
            videoARef.current.src = deckAVideo;
            videoARef.current.play().catch(e => console.warn('VJ A play failed', e));
        } else if (videoARef.current) {
            videoARef.current.pause();
        }
    }, [deckAVideo]);

    useEffect(() => {
        if (videoBRef.current && deckBVideo) {
            videoBRef.current.src = deckBVideo;
            videoBRef.current.play().catch(e => console.warn('VJ B play failed', e));
        } else if (videoBRef.current) {
            videoBRef.current.pause();
        }
    }, [deckBVideo]);

    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setEffect(activeEffect);
        }
    }, [activeEffect]);

    const getBlendMode = (mid: number): string => {
        if (mid > 6) return 'screen';
        if (mid < -6) return 'multiply';
        return 'normal';
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            {/* Hidden Source Videos */}
            <video ref={videoARef} className="hidden" muted loop playsInline />
            <video ref={videoBRef} className="hidden" muted loop playsInline />

            {/* WebGL Renderer */}
            <div className="absolute inset-0 w-full h-full">
                <VJRenderer
                    ref={rendererRef}
                    videoSourceA={videoARef.current}
                    videoSourceB={videoBRef.current}
                    opacityA={chA.volume}
                    opacityB={chB.volume}
                    mixBlendModeB={getBlendMode(chB.mid)}
                />
            </div>

            {/* Drum Video Clip Overlay */}
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
            {(!deckAVideo && !deckBVideo && !drumVideoClip && activeEffect === 'none') && (
                <div className="flex items-center justify-center h-full opacity-10">
                    <span className="text-6xl font-bold text-gray-800">MASTER OUTPUT</span>
                </div>
            )}
        </div>
    );
};

export default MasterVideoOutput;
