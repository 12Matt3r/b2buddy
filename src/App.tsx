import React, { useState, useEffect } from 'react';
import { Layout, BarChart2, Radio } from 'lucide-react'; // Added icons
import DJDeck from './components/DJDeck';
import Mixer from './components/Mixer';
import Library from './components/Library';
import DrumRack from './components/DrumRack';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { Track } from './types';
import { aiService } from './services/AILearningService';
import { aiB2BService, AIAction } from './services/AIB2BService';
import { useMIDI } from './hooks/useMIDI';

function App() {
  // Navigation State
  const [view, setView] = useState<'studio' | 'analytics'>('studio');

  // App State
  const [deckATrack, setDeckATrack] = useState<Track | null>(null);
  const [deckBTrack, setDeckBTrack] = useState<Track | null>(null);
  const [isB2BActive, setIsB2BActive] = useState(false);

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

  // B2B Logic Handler
  const handleAIAction = (action: AIAction) => {
      console.log("AI Action Received:", action);
      if (action.type === 'LOAD_TRACK' && action.deckId !== undefined) {
          if (action.deckId === 1) setDeckBTrack(action.payload);
          else setDeckATrack(action.payload);
      } else if (action.type === 'CROSSFADER' && action.value !== undefined) {
          // Smooth transition could go here, but jumping for MVP
          setCrossfader(action.value);
      }
  };

  // Toggle B2B
  const toggleB2B = () => {
      if (isB2BActive) {
          aiB2BService.stopB2B();
          setIsB2BActive(false);
      } else {
          aiB2BService.startB2B(handleAIAction);
          setIsB2BActive(true);
      }
  };

  // Effects
  useEffect(() => {
    if (lastMessage) {
       console.log("MIDI Input received:", lastMessage);
       if (lastMessage.data[0] === 176 && lastMessage.data[1] === 1) {
          const normalized = (lastMessage.data[2] / 127) * 2 - 1;
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
    <div className="h-screen bg-gray-900 text-white flex overflow-hidden font-sans">
      {/* Sidebar Library */}
      <Library onLoadTrack={handleLoadTrack} onLoadSample={handleLoadSample} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">

        {/* Top Navigation Bar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex justify-between items-center px-6 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-purple-600 p-2 rounded-lg shadow-lg shadow-purple-900/50">
                <Layout size={24} className="text-white" />
             </div>
             <div>
                <h1 className="text-xl font-bold leading-none">B2Buddy <span className="text-purple-400">AI Arena</span></h1>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                    {lastMessage ? <span className="text-green-400">MIDI ACTIVE</span> : <span>NO MIDI</span>}
                </div>
             </div>
          </div>

          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
              <button
                onClick={() => setView('studio')}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${view === 'studio' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  <Layout size={16} /> Studio
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${view === 'analytics' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  <BarChart2 size={16} /> Analytics
              </button>
          </div>

          <button
             onClick={toggleB2B}
             className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border transition-all ${isB2BActive ? 'bg-red-500 border-red-400 text-white animate-pulse' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
          >
              <Radio size={16} /> {isB2BActive ? 'STOP B2B' : 'START B2B'}
          </button>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative">
            {view === 'studio' ? (
                <div className="h-full flex flex-col p-6 overflow-y-auto">
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
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span className={isB2BActive ? "text-green-400" : "text-gray-500"}>{isB2BActive ? "ACTIVE" : "STANDBY"}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className={`w-2/3 h-full ${isB2BActive ? "bg-purple-500 animate-pulse" : "bg-gray-600"}`}></div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {isB2BActive ? "AI is listening and preparing next track..." : "Waiting for session start."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full p-6">
                    <AnalyticsDashboard />
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default App;
