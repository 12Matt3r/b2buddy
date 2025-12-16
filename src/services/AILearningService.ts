import { AIPersonality } from '../types';

export interface Interaction {
    type: 'fader' | 'eq' | 'load_track' | 'play_pause';
    target: string;
    value: any;
    timestamp: number;
}

class AILearningService {
    private interactions: Interaction[] = [];
    private sessionStartTime: number = Date.now();
    private personality: AIPersonality = {
        riskTolerance: 50,
        energyManagement: 50,
        genreExploration: 30,
        crowdAdaptation: 50,
        learningVelocity: 10
    };

    // Subscriptions
    private listeners: ((p: AIPersonality) => void)[] = [];

    subscribe(callback: (p: AIPersonality) => void) {
        this.listeners.push(callback);
        callback(this.personality);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notify() {
        this.listeners.forEach(l => l(this.personality));
    }

    logInteraction(type: Interaction['type'], target: string, value: any) {
        const interaction: Interaction = {
            type,
            target,
            value,
            timestamp: Date.now()
        };
        this.interactions.push(interaction);
        console.debug('AI Log:', interaction);

        // Update personality based on interaction
        this.evolvePersonality(interaction);
    }

    private evolvePersonality(interaction: Interaction) {
        // Simplified Logic mimicking the prompt
        let changed = false;

        // Example: Frequent Crossfader movement -> High Energy Management
        if (interaction.type === 'fader' && interaction.target === 'crossfader') {
            this.personality.energyManagement = Math.min(100, this.personality.energyManagement + 0.5);
            changed = true;
        }

        // Example: Loading Tracks -> Exploration
        if (interaction.type === 'load_track') {
            this.personality.genreExploration = Math.min(100, this.personality.genreExploration + 1);
            this.personality.riskTolerance = Math.min(100, this.personality.riskTolerance + 0.2);
            changed = true;
        }

        // Example: EQ Usage -> Crowd Adaptation (Fine tuning)
        if (interaction.type === 'eq') {
            this.personality.crowdAdaptation = Math.min(100, this.personality.crowdAdaptation + 0.5);
            changed = true;
        }

        if (changed) {
            this.notify();
        }
    }

    getPersonality(): AIPersonality {
        return { ...this.personality };
    }

    getSessionSummary() {
        return {
            duration: Date.now() - this.sessionStartTime,
            interactionCount: this.interactions.length,
            interactions: this.interactions,
            finalPersonality: this.personality
        };
    }
}

export const aiService = new AILearningService();
