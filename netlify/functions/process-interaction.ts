import { Handler } from '@netlify/functions';

// Define expected types locally to avoid importing from src (which might fail in some lambda build environments depending on config)
interface Interaction {
    type: string;
    target: string;
    value?: any;
    timestamp?: number;
}

interface AIPersonality {
    riskTolerance: number;
    energyManagement: number;
    genreExploration: number;
    crowdAdaptation: number;
    learningVelocity: number;
}

const isValidInteraction = (i: any): i is Interaction => {
    return i && typeof i.type === 'string' && typeof i.target === 'string';
};

const isValidPersonality = (p: any): p is AIPersonality => {
    return (
        p &&
        typeof p.riskTolerance === 'number' &&
        typeof p.energyManagement === 'number' &&
        typeof p.genreExploration === 'number' &&
        typeof p.crowdAdaptation === 'number' &&
        typeof p.learningVelocity === 'number'
    );
};

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!event.body) {
         return { statusCode: 400, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    try {
        const { interaction, aiPersonality } = JSON.parse(event.body);

        // Security: Input Validation
        if (!isValidInteraction(interaction)) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid interaction data' }) };
        }

        if (!isValidPersonality(aiPersonality)) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid personality data' }) };
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
        // Security: Don't leak stack traces
        console.error('Processing error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process interaction' }) };
    }
};
