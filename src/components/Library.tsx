import React, { useState } from 'react';
import { Track, Playlist } from '../types';
import { Music, List, Upload, FolderPlus, Search, Grid, Plus, Loader2, Video, ListVideo } from 'lucide-react';

interface LibraryProps {
    onLoadTrack: (track: Track, deckId: number) => void;
    onLoadSample: (url: string, name: string) => void;
}

// Mock Data
const MOCK_TRACKS: Track[] = [
    { id: '1', title: 'Acid Rain', artist: 'Techno Viking', bpm: 128, key: 'Am', duration: 345, url: '/samples/acid.mp3', type: 'audio' },
    { id: '2', title: 'Deep Ocean', artist: 'Aqua Flow', bpm: 122, key: 'Cm', duration: 280, url: '/samples/deep.mp3', type: 'audio' },
    { id: '3', title: 'Sunset Groove', artist: 'Solar Rhythms', bpm: 124, key: 'G', duration: 310, url: '/samples/sunset.mp3', type: 'audio' },
    { id: '4', title: 'Industrial Hammer', artist: 'Factory Floor', bpm: 135, key: 'Dm', duration: 290, url: '/samples/industrial.mp3', type: 'audio' },
];

const MOCK_SAMPLES = [
    { id: 's1', name: 'Deep Kick', url: 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3' },
    { id: 's2', name: 'Sharp Snare', url: 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3' },
    { id: 's3', name: 'Open Hat', url: 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3' },
    { id: 's4', name: 'Clap FX', url: 'https://tonejs.github.io/audio/drum-samples/CR78/tom1.mp3' },
];

const Library: React.FC<LibraryProps> = ({ onLoadTrack, onLoadSample }) => {
    const [activeTab, setActiveTab] = useState<'tracks' | 'playlists' | 'samples' | 'queue'>('tracks');
    const [searchQuery, setSearchQuery] = useState('');
    const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
    const [playlists, setPlaylists] = useState<Playlist[]>([
        { id: 'p1', name: 'Warmup Set', tracks: [MOCK_TRACKS[0], MOCK_TRACKS[2]] }
    ]);
    const [samples] = useState(MOCK_SAMPLES);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>('p1');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [youtubeTitle, setYoutubeTitle] = useState('');

    // VJ Queue State
    const [vjQueue, setVjQueue] = useState<Track[]>([]);

    const filteredTracks = tracks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreatePlaylist = () => {
        const name = prompt('Enter playlist name:');
        if (name) {
            const newId = `p${Date.now()}`;
            setPlaylists([...playlists, { id: newId, name, tracks: [] }]);
            setSelectedPlaylistId(newId);
        }
    };

    const handleLoadYouTubeTrack = () => {
        if (videoUrl && audioUrl && youtubeTitle) {
            const newTrack: Track = {
                id: `youtube-${Date.now()}`,
                title: youtubeTitle,
                artist: 'YouTube',
                bpm: 120,
                key: 'C',
                duration: 0,
                url: '',
                audioUrl,
                videoUrl,
                type: 'video',
            };
            setTracks([...tracks, newTrack]);
            setVideoUrl('');
            setAudioUrl('');
            setYoutubeTitle('');
        }
    };

    const handleAddToPlaylist = (track: Track) => {
        if (!selectedPlaylistId) {
            alert("Create or select a playlist first!");
            setActiveTab('playlists');
            return;
        }

        setPlaylists(playlists.map(p => {
            if (p.id === selectedPlaylistId) {
                // Prevent duplicates? For now allow.
                return { ...p, tracks: [...p.tracks, track] };
            }
            return p;
        }));
    };

    const handleAddToQueue = (track: Track) => {
        setVjQueue([...vjQueue, track]);
    };

    const handleRemoveFromQueue = (index: number) => {
        const newQueue = [...vjQueue];
        newQueue.splice(index, 1);
        setVjQueue(newQueue);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsAnalyzing(true);

            // Simulate Analysis Delay
            setTimeout(() => {
                const url = URL.createObjectURL(file);

                // Mock BPM Analysis: Generate random realistic BPM between 120-140
                const mockBpm = Math.floor(Math.random() * (140 - 120 + 1)) + 120;

                // Mock Key Analysis
                const keys = ['Am', 'C', 'G', 'Dm', 'F', 'Em'];
                const mockKey = keys[Math.floor(Math.random() * keys.length)];

                const isVideo = file.type.startsWith('video');

                const newTrack: Track = {
                    id: `local-${Date.now()}`,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: 'Local Artist',
                    bpm: mockBpm,
                    key: mockKey,
                    duration: 300,
                    url,
                    type: isVideo ? 'video' : 'audio',
                    videoUrl: isVideo ? url : undefined
                };

                setTracks([...tracks, newTrack]);
                setIsAnalyzing(false);
            }, 1500);
        }
    };

    return (
        <div className="bg-gray-800 h-full flex flex-col border-r border-gray-700 w-80">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('tracks')}
                    className={`flex-1 p-3 text-sm font-semibold flex justify-center items-center gap-2 ${activeTab === 'tracks' ? 'bg-gray-700 text-purple-400' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <Music size={16} />
                </button>
                <button
                    onClick={() => setActiveTab('playlists')}
                    className={`flex-1 p-3 text-sm font-semibold flex justify-center items-center gap-2 ${activeTab === 'playlists' ? 'bg-gray-700 text-purple-400' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => setActiveTab('queue')}
                    className={`flex-1 p-3 text-sm font-semibold flex justify-center items-center gap-2 ${activeTab === 'queue' ? 'bg-gray-700 text-purple-400' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <ListVideo size={16} />
                </button>
                <button
                    onClick={() => setActiveTab('samples')}
                    className={`flex-1 p-3 text-sm font-semibold flex justify-center items-center gap-2 ${activeTab === 'samples' ? 'bg-gray-700 text-purple-400' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <Grid size={16} />
                </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'tracks' && (
                    <div>
                        <div className="p-2">
                            <div className="bg-gray-700 p-2 rounded-lg">
                                <h3 className="text-xs text-gray-400 font-bold mb-2">Load from YouTube</h3>
                                <input
                                    type="text"
                                    placeholder="Visual URL"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md py-1 px-2 text-sm mb-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Song URL"
                                    value={audioUrl}
                                    onChange={(e) => setAudioUrl(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md py-1 px-2 text-sm mb-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={youtubeTitle}
                                    onChange={(e) => setYoutubeTitle(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md py-1 px-2 text-sm mb-2"
                                />
                                <button
                                    onClick={handleLoadYouTubeTrack}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-sm"
                                >
                                    Load YouTube Track
                                </button>
                            </div>
                        </div>
                        <div className="p-2">
                             <label className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm mb-2 transition-colors ${isAnalyzing ? 'bg-gray-700 text-gray-400 cursor-wait' : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/60'}`}>
                                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {isAnalyzing ? 'Analyzing Media...' : 'Import Media (Audio/Video)'}
                                <input type="file" accept="audio/*,video/*" onChange={handleFileUpload} className="hidden" disabled={isAnalyzing} />
                            </label>
                        </div>
                        {filteredTracks.map(track => (
                            <div key={track.id} className="p-3 hover:bg-gray-700 border-b border-gray-700/50 group">
                                <div className="flex justify-between items-start">
                                    <div className="font-medium text-sm text-gray-200 flex items-center gap-2">
                                        {track.type === 'video' ? <Video size={14} className="text-blue-400" /> : <Music size={14} className="text-gray-500" />}
                                        {track.title}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleAddToQueue(track)}
                                            className="text-gray-500 hover:text-blue-400"
                                            title="Add to VJ Queue"
                                        >
                                            <ListVideo size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleAddToPlaylist(track)}
                                            className="text-gray-500 hover:text-purple-400"
                                            title="Add to selected playlist"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>{track.artist}</span>
                                    <span>{track.bpm} BPM • {track.key}</span>
                                </div>
                                <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onLoadTrack(track, 0)}
                                        className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                                    >
                                        Load A
                                    </button>
                                    <button
                                        onClick={() => onLoadTrack(track, 1)}
                                        className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                                    >
                                        Load B
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div className="p-2">
                        <button
                            onClick={handleCreatePlaylist}
                            className="w-full mb-3 flex items-center justify-center gap-2 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer text-sm"
                        >
                            <FolderPlus size={16} /> New Playlist
                        </button>
                        {playlists.map(pl => (
                            <div
                                key={pl.id}
                                onClick={() => setSelectedPlaylistId(pl.id)}
                                className={`p-3 mb-2 bg-gray-900 rounded border cursor-pointer ${selectedPlaylistId === pl.id ? 'border-purple-500' : 'border-gray-700 hover:border-gray-500'}`}
                            >
                                <div className="font-bold text-sm flex justify-between">
                                    {pl.name}
                                    {selectedPlaylistId === pl.id && <span className="text-[10px] text-purple-400 bg-purple-900/30 px-1 rounded">ACTIVE</span>}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{pl.tracks.length} tracks</div>
                                {selectedPlaylistId === pl.id && pl.tracks.length > 0 && (
                                    <div className="mt-2 pl-2 border-l-2 border-gray-700 space-y-1">
                                        {pl.tracks.map((t, idx) => (
                                            <div key={`${t.id}-${idx}`} className="text-xs text-gray-400 truncate flex justify-between group">
                                                <span>{t.title}</span>
                                                <div className="hidden group-hover:flex gap-1">
                                                     <button onClick={(e) => { e.stopPropagation(); onLoadTrack(t, 0); }} className="hover:text-white">A</button>
                                                     <button onClick={(e) => { e.stopPropagation(); onLoadTrack(t, 1); }} className="hover:text-white">B</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'queue' && (
                    <div className="p-2">
                        <div className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">VJ Queue</div>
                        {vjQueue.length === 0 && <div className="text-xs text-gray-600 italic text-center p-4">Queue is empty</div>}
                        {vjQueue.map((track, idx) => (
                            <div key={`${track.id}-queue-${idx}`} className="p-2 mb-2 bg-gray-900 rounded border border-gray-700 flex justify-between items-center group">
                                <div className="overflow-hidden">
                                    <div className="text-sm font-medium truncate">{track.title}</div>
                                    <div className="text-xs text-gray-500">{track.type.toUpperCase()}</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button onClick={() => onLoadTrack(track, 0)} className="text-xs bg-purple-600 px-2 py-1 rounded">A</button>
                                         <button onClick={() => onLoadTrack(track, 1)} className="text-xs bg-purple-600 px-2 py-1 rounded">B</button>
                                    </div>
                                    <button onClick={() => handleRemoveFromQueue(idx)} className="text-gray-500 hover:text-red-400">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'samples' && (
                    <div className="p-2">
                         <div className="text-xs text-gray-400 mb-2 p-1">Drag sample to pad or click +</div>
                         {samples.map(sample => (
                             <div key={sample.id} className="p-3 mb-2 bg-gray-900 rounded border border-gray-700 flex justify-between items-center">
                                 <span className="text-sm">{sample.name}</span>
                                 <button
                                    onClick={() => onLoadSample(sample.url, sample.name)}
                                    className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                                 >
                                     +
                                 </button>
                             </div>
                         ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
