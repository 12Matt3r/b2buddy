import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { interaction, aiPersonality } = JSON.parse(event.body || '{}');

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
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process interaction' }) };
    }
};
