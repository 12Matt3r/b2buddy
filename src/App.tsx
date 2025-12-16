import React, { useState, useEffect } from 'react';
import { Layout } from 'lucide-react';
import DJDeck from './components/DJDeck';
import Mixer from './components/Mixer';
import Library from './components/Library';
import DrumRack from './components/DrumRack';
import { Track } from './types';
import { aiService } from './services/AILearningService';
import { useMIDI } from './hooks/useMIDI';

function App() {
  // State
  const [deckATrack, setDeckATrack] = useState<Track | null>(null);
  const [deckBTrack, setDeckBTrack] = useState<Track | null>(null);

  const [crossfader, setCrossfader] = useState(0);
  const [volumes, setVolumes] = useState<[number, number]>([1, 1]);
  const [eqs, setEQs] = useState<[{high: number, mid: number, low: number}, {high: number, mid: number, low: number}]>([
    { high: 0, mid: 0, low: 0 },
    { high: 0, mid: 0, low: 0 }
  ]);

  // State for Sample Assignment
  const [pendingSample, setPendingSample] = useState<{url: string, name: string} | null>(null);

  // Hooks
  const { lastMessage } = useMIDI();

  // Effects
  useEffect(() => {
    if (lastMessage) {
       // Simple MIDI Mapping example (Pseudo-code as devices vary wildly)
       // If CC message on channel 1, map to crossfader, etc.
       console.log("MIDI Input received:", lastMessage);

       // Example: Map CC 1 to Crossfader
       if (lastMessage.data[0] === 176 && lastMessage.data[1] === 1) { // 176 is CC Ch1
          const normalized = (lastMessage.data[2] / 127) * 2 - 1; // 0-127 -> -1 to 1
          handleCrossfaderChange(normalized);
       }
    }
  }, [lastMessage]);

  // Handlers
  const handleLoadTrack = (track: Track, deckId: number) => {
    if (deckId === 0) setDeckATrack(track);
    else setDeckBTrack(track);

    aiService.logInteraction('load_track', `deck_${deckId}`, track.id);
  };

  const handleLoadSample = (url: string, name: string) => {
     setPendingSample({ url, name });
  };

  const handleSampleAssigned = () => {
      setPendingSample(null);
  };

  const handleDeckParamChange = (deckId: number, param: string, value: any) => {
      // Logic to update state if we were lifting deck state up (currently mostly internal to deck)
      // Log for AI
      aiService.logInteraction('play_pause', `deck_${deckId}_${param}`, value);
  };

  const handleCrossfaderChange = (val: number) => {
    setCrossfader(val);
    aiService.logInteraction('fader', 'crossfader', val);
  };

  const handleVolumeChange = (deckIndex: number, val: number) => {
    const newVols = [...volumes] as [number, number];
    newVols[deckIndex] = val;
    setVolumes(newVols);
    aiService.logInteraction('fader', `vol_ch${deckIndex}`, val);
  };

  const handleEQChange = (deckIndex: number, band: 'high' | 'mid' | 'low', val: number) => {
    const newEQs = [...eqs] as typeof eqs;
    newEQs[deckIndex] = { ...newEQs[deckIndex], [band]: val };
    setEQs(newEQs);
    aiService.logInteraction('eq', `eq_ch${deckIndex}_${band}`, val);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex overflow-hidden">
      {/* Sidebar Library */}
      <Library onLoadTrack={handleLoadTrack} onLoadSample={handleLoadSample} />

      {/* Main DJ Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-purple-600 p-2 rounded-lg">
                <Layout size={24} />
             </div>
             <h1 className="text-2xl font-bold">B2Buddy <span className="text-purple-400">Studio</span></h1>
          </div>
          <div className="text-sm text-gray-400">
             {lastMessage ? <span className="text-green-400">MIDI Connected</span> : <span>Waiting for MIDI...</span>}
          </div>
        </div>

        {/* Decks & Mixer Row */}
        <div className="flex justify-center items-start gap-6 mb-6">
          <DJDeck
             id={1}
             track={deckATrack}
             isActive={crossfader < 0.5}
             onParameterChange={(p, v) => handleDeckParamChange(0, p, v)}
          />

          <Mixer
             crossfader={crossfader}
             setCrossfader={handleCrossfaderChange}
             volumes={volumes}
             setVolume={handleVolumeChange}
             eqs={eqs}
             setEQ={handleEQChange}
          />

          <DJDeck
             id={2}
             track={deckBTrack}
             isActive={crossfader > -0.5}
             onParameterChange={(p, v) => handleDeckParamChange(1, p, v)}
          />
        </div>

        {/* Bottom Section: Drum Rack & AI Status */}
        <div className="flex gap-6">
           <div className="flex-1">
              <DrumRack pendingSample={pendingSample} onSampleAssigned={handleSampleAssigned} />
           </div>

           <div className="w-80 bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-gray-400 font-bold mb-3 uppercase text-xs tracking-wider">AI B2B Partner</h3>
              <div className="text-sm text-gray-300 space-y-2">
                 <p>Monitoring your style...</p>
                 <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 w-2/3 h-full animate-pulse"></div>
                 </div>
                 <p className="text-xs text-gray-500">Analysis: Learning transition curves.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default App;
