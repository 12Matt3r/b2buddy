import React, { useState } from 'react';
import { Track, Playlist } from '../types';
import { Music, List, Upload, FolderPlus, Search, Grid } from 'lucide-react';

interface LibraryProps {
    onLoadTrack: (track: Track, deckId: number) => void;
    onLoadSample: (url: string, name: string) => void; // New prop for loading samples to drum rack
}

// Mock Data
const MOCK_TRACKS: Track[] = [
    { id: '1', title: 'Acid Rain', artist: 'Techno Viking', bpm: 128, key: 'Am', duration: 345, url: '/samples/acid.mp3' },
    { id: '2', title: 'Deep Ocean', artist: 'Aqua Flow', bpm: 122, key: 'Cm', duration: 280, url: '/samples/deep.mp3' },
    { id: '3', title: 'Sunset Groove', artist: 'Solar Rhythms', bpm: 124, key: 'G', duration: 310, url: '/samples/sunset.mp3' },
    { id: '4', title: 'Industrial Hammer', artist: 'Factory Floor', bpm: 135, key: 'Dm', duration: 290, url: '/samples/industrial.mp3' },
];

const MOCK_SAMPLES = [
    { id: 's1', name: 'Deep Kick', url: 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3' },
    { id: 's2', name: 'Sharp Snare', url: 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3' },
    { id: 's3', name: 'Open Hat', url: 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3' },
    { id: 's4', name: 'Clap FX', url: 'https://tonejs.github.io/audio/drum-samples/CR78/tom1.mp3' },
];

const Library: React.FC<LibraryProps> = ({ onLoadTrack, onLoadSample }) => {
    const [activeTab, setActiveTab] = useState<'tracks' | 'playlists' | 'samples'>('tracks');
    const [searchQuery, setSearchQuery] = useState('');
    const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
    const [playlists, setPlaylists] = useState<Playlist[]>([
        { id: 'p1', name: 'Warmup Set', tracks: [MOCK_TRACKS[0], MOCK_TRACKS[2]] }
    ]);
    const [samples] = useState(MOCK_SAMPLES);

    const filteredTracks = tracks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreatePlaylist = () => {
        const name = prompt('Enter playlist name:');
        if (name) {
            setPlaylists([...playlists, { id: `p${Date.now()}`, name, tracks: [] }]);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newTrack: Track = {
                id: `local-${Date.now()}`,
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Unknown',
                bpm: 0, // Would need analysis
                key: '-',
                duration: 0, // Would need analysis
                url
            };
            setTracks([...tracks, newTrack]);
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
                             <label className="flex items-center gap-2 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer text-sm mb-2">
                                <Upload size={16} /> Import File
                                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                        </div>
                        {filteredTracks.map(track => (
                            <div key={track.id} className="p-3 hover:bg-gray-700 border-b border-gray-700/50 group">
                                <div className="font-medium text-sm text-gray-200">{track.title}</div>
                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                    <span>{track.artist}</span>
                                    <span>{track.bpm} BPM</span>
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
                            <div key={pl.id} className="p-3 mb-2 bg-gray-900 rounded border border-gray-700 hover:border-purple-500 cursor-pointer">
                                <div className="font-bold text-sm">{pl.name}</div>
                                <div className="text-xs text-gray-500">{pl.tracks.length} tracks</div>
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
