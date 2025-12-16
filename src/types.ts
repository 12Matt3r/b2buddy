export interface Track {
    id: string;
    title: string;
    artist: string;
    bpm: number;
    key: string;
    duration: number;
    url: string; // URL to audio file
}

export interface Playlist {
    id: string;
    name: string;
    tracks: Track[];
}

export interface DeckState {
    track: Track | null;
    playing: boolean;
    bpm: number;
    pitch: number; // Percentage -10 to +10 usually
    volume: number;
    position: number; // Current playback position in seconds
}

export interface MixerState {
    crossfader: number; // -1 to 1
    channel1: {
        volume: number;
        high: number;
        mid: number;
        low: number;
    };
    channel2: {
        volume: number;
        high: number;
        mid: number;
        low: number;
    };
}

export interface AIPersonality {
    riskTolerance: number; // 0-100
    energyManagement: number; // 0-100
    genreExploration: number; // 0-100
    crowdAdaptation: number; // 0-100
    learningVelocity: number; // 0-100
}

export interface SessionAnalytics {
    sessionId: string;
    startTime: number;
    duration: number;
    interactions: number;
    averageEnergy: number;
    aiPersonalitySnapshot: AIPersonality;
}
