import { Track, AIPersonality } from '../types';
import { aiService } from './AILearningService';

// Mock AI Logic for B2B Partner

class AIB2BService {
    private isEnabled: boolean = false;
    private intervalId: any = null;
    private onActionCallback: ((action: AIAction) => void) | null = null;

    startB2B(callback: (action: AIAction) => void) {
        this.isEnabled = true;
        this.onActionCallback = callback;
        console.log("AI B2B Partner Started");

        // Start the "Brain" loop
        this.intervalId = setInterval(() => {
            this.think();
        }, 5000); // AI thinks every 5 seconds
    }

    stopB2B() {
        this.isEnabled = false;
        if (this.intervalId) clearInterval(this.intervalId);
        this.onActionCallback = null;
        console.log("AI B2B Partner Stopped");
    }

    private think() {
        if (!this.isEnabled || !this.onActionCallback) return;

        const personality = aiService.getPersonality();

        // Randomly decide to do something based on personality
        const roll = Math.random() * 100;

        if (roll < personality.riskTolerance) {
            // Do something "Risky" -> Like loading a new track
            this.decideTrackLoad();
        } else if (roll < personality.energyManagement) {
            // Adjust volume or EQ
            this.decideMixing();
        }
    }

    private decideTrackLoad() {
        // Mock selecting a random track from "Library"
        // In a real app, this service would need access to the Library
        const mockTracks = [
            { id: 'ai_1', title: 'Cyber Pulse', artist: 'AI Bot', bpm: 130, key: 'F#', duration: 300, url: '/samples/industrial.mp3' },
            { id: 'ai_2', title: 'Neural Net', artist: 'Deep Mind', bpm: 126, key: 'Am', duration: 280, url: '/samples/deep.mp3' }
        ];
        const randomTrack = mockTracks[Math.floor(Math.random() * mockTracks.length)];

        this.onActionCallback!({
            type: 'LOAD_TRACK',
            deckId: 1, // AI controls Deck 2 (Index 1)
            payload: randomTrack
        });
    }

    private decideMixing() {
        // AI fades crossfader
        const targetCrossfader = Math.random() > 0.5 ? 0.5 : -0.5; // Move towards center or side

        this.onActionCallback!({
            type: 'CROSSFADER',
            value: targetCrossfader
        });
    }
}

export interface AIAction {
    type: 'LOAD_TRACK' | 'CROSSFADER' | 'EQ';
    deckId?: number;
    value?: any;
    payload?: any;
}

export const aiB2BService = new AIB2BService();
