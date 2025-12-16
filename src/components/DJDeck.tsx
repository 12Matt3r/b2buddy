import React, { useEffect } from 'react';
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
    const { isLoaded, isPlaying, play, pause, setPlaybackRate } = useAudio(track?.url || null);
    const [pitch, setPitch] = React.useState(0); // 0 means 0% pitch shift

    useEffect(() => {
        // Report play state
        onParameterChange('playing', isPlaying);
    }, [isPlaying, onParameterChange]);

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
        // Calculate playback rate (simplistic: +/- 8%)
        const rate = 1 + (val / 100) * 0.08;
        setPlaybackRate(rate);
        onParameterChange('pitch', val);
    };

    return (
        <div className={`bg-gray-800 p-4 rounded-lg border-2 ${isActive ? 'border-purple-500' : 'border-gray-700'} w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-300">Deck {id}</h2>
                <div className="text-sm text-gray-400">
                    {track ? `${track.artist} - ${track.title}` : 'No Track Loaded'}
                </div>
            </div>

            {/* Jog Wheel Simulation */}
            <div className={`w-48 h-48 mx-auto rounded-full border-4 border-gray-600 flex items-center justify-center mb-6 relative ${isPlaying ? 'animate-spin-slow' : ''}`}>
               <Disc size={120} className="text-gray-500" />
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handlePlayToggle}
                        disabled={!isLoaded}
                        className={`p-4 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-600'} hover:opacity-80 transition-all`}
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs">Pitch</span>
                    <input
                        type="range"
                        min="-100"
                        max="100"
                        value={pitch}
                        onChange={handlePitchChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs w-8 text-right">{pitch}%</span>
                </div>

                <div className="text-center text-sm font-mono text-purple-400">
                    {track ? `${track.bpm} BPM` : '-- BPM'}
                </div>
            </div>
        </div>
    );
};

export default DJDeck;
