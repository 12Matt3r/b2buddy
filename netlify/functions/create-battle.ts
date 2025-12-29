import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { rounds = 3, difficulty = 'normal' } = JSON.parse(event.body || '{}');

        // SECURITY: Input Validation
        if (!Number.isInteger(rounds) || rounds < 1 || rounds > 10) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid rounds. Must be an integer between 1 and 10.' })
            };
        }

        const validDifficulties = ['easy', 'normal', 'hard'];
        if (typeof difficulty !== 'string' || !validDifficulties.includes(difficulty)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid difficulty. Must be easy, normal, or hard.' })
            };
        }

        const battleId = `battle_${Date.now()}`;

        // Initialize Battle State
        const battleState = {
            id: battleId,
            rounds,
            difficulty,
            status: 'active',
            currentRound: 1,
            scores: { player: 0, ai: 0 }
        };

        return {
            statusCode: 200,
            body: JSON.stringify(battleState),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create battle' }) };
    }
};
