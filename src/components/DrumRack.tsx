import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const DEFAULT_SAMPLES = [
    { note: 'C3', name: 'Kick', color: 'bg-red-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3' },
    { note: 'D3', name: 'Snare', color: 'bg-yellow-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3' },
    { note: 'E3', name: 'HiHat', color: 'bg-blue-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3' },
    { note: 'F3', name: 'Clap', color: 'bg-orange-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/tom1.mp3' },
    { note: 'G3', name: 'Perc 1', color: 'bg-purple-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/tom2.mp3' },
    { note: 'A3', name: 'Perc 2', color: 'bg-green-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/tom3.mp3' },
    { note: 'B3', name: 'OH', color: 'bg-pink-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/bongo1.mp3' },
    { note: 'C4', name: 'Crash', color: 'bg-teal-500', url: 'https://tonejs.github.io/audio/drum-samples/CR78/bongo2.mp3' },
];

interface DrumRackProps {
    pendingSample: { url: string, name: string } | null;
    onSampleAssigned: () => void;
}

const DrumRack: React.FC<DrumRackProps> = ({ pendingSample, onSampleAssigned }) => {
    const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
    const [activePad, setActivePad] = useState<string | null>(null);
    const [padConfig, setPadConfig] = useState(DEFAULT_SAMPLES);

    useEffect(() => {
        // Initialize sampler with default urls
        const sampleMap: {[key: string]: string} = {};
        padConfig.forEach(s => sampleMap[s.note] = s.url);

        const newSampler = new Tone.Sampler({
            urls: sampleMap,
            onload: () => console.log('Drum samples loaded'),
        }).toDestination();

        setSampler(newSampler);

        return () => {
            newSampler.dispose();
        };
    }, []); // In a real app we'd need to re-init or use .add() when config changes, but Tone.Sampler is static once loaded usually.
            // For this MVP, we will just update the UI name. Updating the actual audio source dynamically in Tone.js requires disposing/recreating or using a different architecture (Buffers).

    const triggerPad = async (note: string) => {
        if (!sampler) return;
        await Tone.start();
        sampler.triggerAttack(note);
        setActivePad(note);
        setTimeout(() => setActivePad(null), 100);
    };

    const handlePadClick = (index: number) => {
        const pad = padConfig[index];
        if (pendingSample) {
            // Assign new sample to this pad
            const newConfig = [...padConfig];
            newConfig[index] = { ...pad, name: pendingSample.name, url: pendingSample.url };
            setPadConfig(newConfig);

            // Re-creating sampler for the new sample (Expensive but simple for MVP)
            if (sampler) sampler.dispose();
            const sampleMap: {[key: string]: string} = {};
            newConfig.forEach(s => sampleMap[s.note] = s.url);
            const newSampler = new Tone.Sampler({
                urls: sampleMap,
                onload: () => console.log('Drum samples reloaded'),
            }).toDestination();
            setSampler(newSampler);

            onSampleAssigned();
        } else {
            triggerPad(pad.note);
        }
    };

    return (
        <div className={`bg-gray-800 p-4 rounded-lg border ${pendingSample ? 'border-yellow-400 animate-pulse' : 'border-gray-700'}`}>
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider">Drum Rack</h3>
                 {pendingSample && <span className="text-xs text-yellow-400 font-bold">SELECT PAD TO ASSIGN</span>}
            </div>

            <div className="grid grid-cols-4 gap-2">
                {padConfig.map((sample, index) => (
                    <button
                        key={sample.note}
                        onMouseDown={() => handlePadClick(index)}
                        className={`
                            h-16 rounded-md flex flex-col items-center justify-center transition-all relative overflow-hidden
                            ${activePad === sample.note ? 'brightness-150 scale-95 shadow-inner' : 'hover:brightness-110'}
                            ${sample.color}
                        `}
                    >
                        <span className="text-xs font-bold z-10">{sample.name}</span>
                        <span className="text-[10px] opacity-50 z-10">{sample.note}</span>
                        {pendingSample && <div className="absolute inset-0 bg-white/20 hover:bg-white/40 z-20"></div>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DrumRack;
