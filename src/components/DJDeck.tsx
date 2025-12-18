import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Play, Pause, Disc, Video } from 'lucide-react';
import { Track } from '../types';
import { useAudio } from '../hooks/useAudio';

export interface DJDeckRef {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
}

interface DJDeckProps {
    id: number;
    track: Track | null;
    isActive: boolean;
    volume: number; // Added volume prop
    onTrackEnd?: () => void;
    onParameterChange: (param: string, value: any) => void;
}

const DJDeck = forwardRef<DJDeckRef, DJDeckProps>(({ id, track, isActive, volume, onParameterChange }, ref) => {

    const isVideo = track?.type === 'video';
    // Destructure setVolume from useAudio
    const { isLoaded, isPlaying, play: playAudio, pause: pauseAudio, setPlaybackRate, setVolume, getWaveformData } = useAudio(!isVideo ? (track?.url || null) : null);

    const [pitch, setPitch] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const animationRef = useRef<number>();

    const [videoPlaying, setVideoPlaying] = useState(false);

    const isDeckPlaying = isVideo ? videoPlaying : isPlaying;
    const isDeckLoaded = isVideo ? !!track?.videoUrl : isLoaded;

    useImperativeHandle(ref, () => ({
        play: () => {
            if (isDeckLoaded) handlePlay();
        },
        pause: () => {
            if (isDeckLoaded) handlePause();
        },
        togglePlay: () => {
            if (isDeckLoaded) handlePlayToggle();
        }
    }));

    // Update Volume when prop changes
    useEffect(() => {
        if (!isVideo) {
            setVolume(volume);
        } else if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume, isVideo, setVolume]);

    useEffect(() => {
        onParameterChange('playing', isDeckPlaying);
    }, [isDeckPlaying, onParameterChange]);

    // Video Playback Logic
    useEffect(() => {
        if (isVideo && videoRef.current) {
            if (videoPlaying) videoRef.current.play();
            else videoRef.current.pause();
        }
    }, [videoPlaying, isVideo]);

    useEffect(() => {
        if (isVideo && videoRef.current) {
            const rate = 1 + (pitch / 100) * 0.08;
            videoRef.current.playbackRate = rate;
        }
    }, [pitch, isVideo]);


    // Waveform Loop
    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            if (isVideo) {
                ctx.fillStyle = "#333";
                ctx.font = "10px sans-serif";
                ctx.fillText("VIDEO TRACK", 10, height/2);
            } else {
                const data = getWaveformData();
                if (data) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = isActive ? '#a855f7' : '#6b7280';
                    ctx.beginPath();

                    const sliceWidth = width * 1.0 / data.length;
                    let x = 0;

                    for (let i = 0; i < data.length; i++) {
                        const v = (data[i] as number);
                        const y = (v * height / 2) + height / 2;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                        x += sliceWidth;
                    }
                    ctx.lineTo(canvas.width, canvas.height / 2);
                    ctx.stroke();
                }
            }
            animationRef.current = requestAnimationFrame(draw);
        };

        if (isDeckPlaying) {
            draw();
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isDeckPlaying, getWaveformData, isActive, isVideo]);

    const handlePlay = () => {
        if (isVideo) setVideoPlaying(true);
        else playAudio();
    };

    const handlePause = () => {
        if (isVideo) setVideoPlaying(false);
        else pauseAudio();
    };

    const handlePlayToggle = () => {
        if (isDeckPlaying) handlePause();
        else handlePlay();
    };

    const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setPitch(val);
        const rate = 1 + (val / 100) * 0.08;
        if (!isVideo) setPlaybackRate(rate);
        onParameterChange('pitch', val);
    };

    return (
        <div className={`bg-gray-800 p-4 rounded-lg border-2 ${isActive ? 'border-purple-500' : 'border-gray-700'} w-full max-w-md shadow-xl relative overflow-hidden`}>
            {/* Background Video Layer */}
            {isVideo && track?.videoUrl && (
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                    <video
                        ref={videoRef}
                        src={track.videoUrl}
                        loop
                        // Removed muted attribute to allow audio
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-300">Deck {id}</h2>
                    <div className="text-sm text-gray-400 truncate max-w-[150px]">
                        {track ? `${track.artist} - ${track.title}` : 'No Track Loaded'}
                    </div>
                </div>

                {/* Visualizer Area */}
                <div className="relative mb-6">
                    <div className={`w-48 h-48 mx-auto rounded-full border-4 border-gray-600 flex items-center justify-center relative overflow-hidden ${isDeckPlaying ? 'animate-spin-slow' : ''}`}>
                        {isVideo ? <Video size={80} className="text-blue-500" /> : <Disc size={120} className="text-gray-500" />}
                    </div>
                    {/* Overlay Waveform Canvas */}
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={60}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/50 rounded backdrop-blur-sm"
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handlePlayToggle}
                            disabled={!isDeckLoaded}
                            className={`p-4 rounded-full ${isDeckPlaying ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-600'} hover:opacity-80 transition-all`}
                        >
                            {isDeckPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">PITCH</span>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            value={pitch}
                            onChange={handlePitchChange}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs w-8 text-right font-mono text-gray-300">{pitch > 0 ? '+' : ''}{pitch}%</span>
                    </div>

                    <div className="text-center text-sm font-mono text-purple-400 bg-purple-900/20 py-1 rounded">
                        {track ? `${track.bpm} BPM` : '-- BPM'}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default DJDeck;
