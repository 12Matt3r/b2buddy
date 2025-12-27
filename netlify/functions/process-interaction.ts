import { Handler } from '@netlify/functions';

// Local Interface Definitions
interface Interaction {
    type: 'fader' | 'eq' | 'load_track' | 'play_pause';
    target: string;
    value: any;
    timestamp: number;
}

interface AIPersonality {
    riskTolerance: number; // 0-100
    energyManagement: number; // 0-100
    genreExploration: number; // 0-100
    crowdAdaptation: number; // 0-100
    learningVelocity: number; // 0-100
}

// Validation Helpers
const validateInteraction = (interaction: any): interaction is Interaction => {
    if (!interaction || typeof interaction !== 'object') return false;
    if (!['fader', 'eq', 'load_track', 'play_pause'].includes(interaction.type)) return false;
    if (typeof interaction.target !== 'string' || interaction.target.trim() === '') return false;
    if (interaction.value === undefined) return false;
    if (typeof interaction.timestamp !== 'number') return false;
    return true;
};

const validatePersonality = (personality: any): personality is AIPersonality => {
    if (!personality || typeof personality !== 'object') return false;
    const traits = ['riskTolerance', 'energyManagement', 'genreExploration', 'crowdAdaptation', 'learningVelocity'];
    for (const trait of traits) {
        if (typeof personality[trait] !== 'number') return false;
        if (personality[trait] < 0 || personality[trait] > 100) return false;
    }
    return true;
};

export const handler: Handler = async (event, context) => {
    // 1. Method Check
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // 2. Body Existence Check
    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    try {
        let parsedBody;
        try {
            parsedBody = JSON.parse(event.body);
        } catch (e) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON format' }) };
        }

        const { interaction, aiPersonality } = parsedBody;

        // 3. Strict Input Validation
        if (!validateInteraction(interaction)) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid interaction data' }) };
        }

        if (!validatePersonality(aiPersonality)) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid AI personality data' }) };
        }

        // Logic to update personality based on interaction
        // This mirrors the frontend mock logic but would run server-side
        // persisting to a real database (e.g., FaunaDB, MongoDB)

        const evolvedPersonality = { ...aiPersonality };

        if (interaction.type === 'fader' && interaction.target === 'crossfader') {
             evolvedPersonality.energyManagement = Math.min(100, evolvedPersonality.energyManagement + 0.5);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                evolvedPersonality,
                timestamp: new Date().toISOString()
            }),
        };
    } catch (error) {
        // Log the error securely (omitting sensitive details in production)
        console.error('Processing Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process interaction' }) };
    }
};
