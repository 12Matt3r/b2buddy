import { useState, useEffect } from 'react';
import { Layout, BarChart2, Radio, Swords } from 'lucide-react';
import DJDeck from './components/DJDeck';
import Mixer from './components/Mixer';
import Library from './components/Library';
import DrumRack from './components/DrumRack';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BattleArena from './components/BattleArena';
import MobileNav from './components/MobileNav';
import { Track } from './types';
import { aiService } from './services/AILearningService';
import { aiB2BService, AIAction } from './services/AIB2BService';
import { battleService } from './services/BattleService';
import { useMIDI } from './hooks/useMIDI';
import { useKeyboardControls } from './hooks/useKeyboardControls';

function App() {
  // Navigation State
  const [view, setView] = useState<'studio' | 'library' | 'battle' | 'analytics'>('studio');

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

  const [pendingSample, setPendingSample] = useState<{url: string, name: string} | null>(null);

  // Hooks
  const { lastMessage } = useMIDI();

  // Handlers needed for Keyboard Hook
  const handleCrossfaderChange = (val: number) => {
    setCrossfader(Math.max(-1, Math.min(1, val))); // Clamp
    aiService.logInteraction('fader', 'crossfader', val);
  };

  // Keyboard Controls
  useKeyboardControls({
      'ArrowLeft': () => handleCrossfaderChange(crossfader - 0.1),
      'ArrowRight': () => handleCrossfaderChange(crossfader + 0.1),
      'c': () => handleCrossfaderChange(0), // Reset center
  });

  // B2B Logic Handler
  const handleAIAction = (action: AIAction) => {
      console.log("AI Action Received:", action);
      if (action.type === 'LOAD_TRACK' && action.deckId !== undefined) {
          if (action.deckId === 1) setDeckBTrack(action.payload);
          else setDeckATrack(action.payload);
      } else if (action.type === 'CROSSFADER' && action.value !== undefined) {
          setCrossfader(action.value);
      }
  };

  const toggleB2B = () => {
      if (isB2BActive) {
          aiB2BService.stopB2B();
          setIsB2BActive(false);
      } else {
          aiB2BService.startB2B(handleAIAction);
          setIsB2BActive(true);
      }
  };

  useEffect(() => {
    if (lastMessage) {
       if (lastMessage.data[0] === 176 && lastMessage.data[1] === 1) {
          const normalized = (lastMessage.data[2] / 127) * 2 - 1;
          handleCrossfaderChange(normalized);
       }
    }
  }, [lastMessage]);

  const handleLoadTrack = (track: Track, deckId: number) => {
    if (deckId === 0) {
        setDeckATrack(track);
        if (view === 'battle') {
            battleService.submitPlayerTurn(track);
        }
    }
    else {
        setDeckBTrack(track);
    }
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
    <div className="h-screen bg-gray-900 text-white flex flex-col md:flex-row overflow-hidden font-sans">
      <div className="hidden md:block h-full border-r border-gray-700">
          {view === 'battle' ? (
              <BattleArena />
          ) : (
              <Library onLoadTrack={handleLoadTrack} onLoadSample={handleLoadSample} />
          )}
      </div>

      <div className="flex-1 flex flex-col h-full relative">
        <div className="hidden md:flex h-16 bg-gray-800 border-b border-gray-700 justify-between items-center px-6 shrink-0 z-20">
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
                onClick={() => setView('battle')}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${view === 'battle' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  <Swords size={16} /> Battle
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

        <div className="md:hidden h-14 bg-gray-800 border-b border-gray-700 flex justify-between items-center px-4 shrink-0">
            <h1 className="text-lg font-bold">B2Buddy</h1>
             <button
                onClick={toggleB2B}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${isB2BActive ? 'bg-red-500 border-red-400' : 'bg-gray-700 border-gray-600'}`}
             >
                 {isB2BActive ? 'B2B ON' : 'B2B OFF'}
             </button>
        </div>

        <div className="flex-1 overflow-hidden relative bg-gray-900 pb-16 md:pb-0">

            <div className={`h-full ${view === 'library' ? 'block' : 'hidden md:hidden'}`}>
                <Library onLoadTrack={handleLoadTrack} onLoadSample={handleLoadSample} />
            </div>

            <div className={`h-full overflow-y-auto ${view === 'studio' ? 'block' : 'hidden'}`}>
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 p-4 md:p-6">
                    <DJDeck
                        id={1}
                        track={deckATrack}
                        isActive={crossfader < 0.5}
                        onParameterChange={(p, v) => handleDeckParamChange(0, p, v)}
                    />

                    <div className="order-last md:order-none w-full md:w-auto flex justify-center">
                        <Mixer
                            crossfader={crossfader}
                            setCrossfader={handleCrossfaderChange}
                            volumes={volumes}
                            setVolume={handleVolumeChange}
                            eqs={eqs}
                            setEQ={handleEQChange}
                        />
                    </div>

                    <DJDeck
                        id={2}
                        track={deckBTrack}
                        isActive={crossfader > -0.5}
                        onParameterChange={(p, v) => handleDeckParamChange(1, p, v)}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-6 p-4 md:px-6 md:pb-6">
                    <div className="flex-1">
                        <DrumRack pendingSample={pendingSample} onSampleAssigned={handleSampleAssigned} />
                    </div>

                    <div className="w-full md:w-80 bg-gray-800 p-4 rounded-lg border border-gray-700">
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

            <div className={`h-full overflow-y-auto ${view === 'battle' ? 'block' : 'hidden'}`}>
                <div className="md:hidden h-full">
                    <BattleArena />
                </div>
                <div className="hidden md:block h-full">
                     <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 p-4 md:p-6">
                        <DJDeck
                            id={1}
                            track={deckATrack}
                            isActive={crossfader < 0.5}
                            onParameterChange={(p, v) => handleDeckParamChange(0, p, v)}
                        />
                        <div className="order-last md:order-none w-full md:w-auto flex justify-center">
                            <Mixer
                                crossfader={crossfader}
                                setCrossfader={handleCrossfaderChange}
                                volumes={volumes}
                                setVolume={handleVolumeChange}
                                eqs={eqs}
                                setEQ={handleEQChange}
                            />
                        </div>
                        <DJDeck
                            id={2}
                            track={deckBTrack}
                            isActive={crossfader > -0.5}
                            onParameterChange={(p, v) => handleDeckParamChange(1, p, v)}
                        />
                    </div>
                </div>
            </div>

            <div className={`h-full overflow-y-auto ${view === 'analytics' ? 'block' : 'hidden'}`}>
                <div className="h-full p-4 md:p-6">
                    <AnalyticsDashboard />
                </div>
            </div>

        </div>

        <MobileNav activeTab={view} onTabChange={setView} />

      </div>
    </div>
  );
}

export default App;
