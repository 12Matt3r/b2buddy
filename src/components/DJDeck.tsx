import React, { useEffect, useRef } from 'react';
import { Play, Pause, Disc } from 'lucide-react';
import { Track } from '../types';
import { useAudio } from '../hooks/useAudio';

interface DJDeckProps {
    id: number;
    track: Track | null;
    isActive: boolean;
    onTrackEnd?: () => void;
    onParameterChange: (param: string, value: any) => void;
}

const DJDeck: React.FC<DJDeckProps> = ({ id, track, isActive, onParameterChange }) => {
    const { isLoaded, isPlaying, play, pause, setPlaybackRate, getWaveformData } = useAudio(track?.url || null);
    const [pitch, setPitch] = React.useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        onParameterChange('playing', isPlaying);
    }, [isPlaying, onParameterChange]);

    // Waveform Loop
    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Get Data
            const data = getWaveformData();
            if (!data) return;

            // Draw Style
            ctx.lineWidth = 2;
            ctx.strokeStyle = isActive ? '#a855f7' : '#6b7280'; // Purple if active, Gray if not
            ctx.beginPath();

            const sliceWidth = width * 1.0 / data.length;
            let x = 0;

            for (let i = 0; i < data.length; i++) {
                // data[i] is between -1 and 1 usually for waveform
                const v = (data[i] as number);
                const y = (v * height / 2) + height / 2;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            animationRef.current = requestAnimationFrame(draw);
        };

        if (isPlaying) {
            draw();
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, getWaveformData, isActive]);

    const handlePlayToggle = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setPitch(val);
        const rate = 1 + (val / 100) * 0.08;
        setPlaybackRate(rate);
        onParameterChange('pitch', val);
    };

    return (
        <div className={`bg-gray-800 p-4 rounded-lg border-2 ${isActive ? 'border-purple-500' : 'border-gray-700'} w-full max-w-md shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-300">Deck {id}</h2>
                <div className="text-sm text-gray-400 truncate max-w-[150px]">
                    {track ? `${track.artist} - ${track.title}` : 'No Track Loaded'}
                </div>
            </div>

            {/* Visualizer Area */}
            <div className="relative mb-6">
                <div className={`w-48 h-48 mx-auto rounded-full border-4 border-gray-600 flex items-center justify-center relative overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <Disc size={120} className="text-gray-500" />
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
                        disabled={!isLoaded}
                        className={`p-4 rounded-full ${isPlaying ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-600'} hover:opacity-80 transition-all`}
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
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
    );
};

export default DJDeck;
