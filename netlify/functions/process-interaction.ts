import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    try {
        const payload = JSON.parse(event.body);
        const { interaction, aiPersonality } = payload;

        // Security Validation
        if (!interaction || typeof interaction !== 'object') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or missing interaction data' }) };
        }
        if (!aiPersonality || typeof aiPersonality !== 'object') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or missing aiPersonality data' }) };
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
        // Do not return error details to client
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON format or request processing failed' }) };
    }
};
