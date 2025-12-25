import { Handler } from '@netlify/functions';

// Valid difficulty levels
const ALLOWED_DIFFICULTIES = ['easy', 'normal', 'hard'] as const;
type Difficulty = typeof ALLOWED_DIFFICULTIES[number];

export const handler: Handler = async (event, context) => {
    // Default headers for all responses
    const headers = {
        'Content-Type': 'application/json',
        // Security headers could be added here in the future
    };

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        let { rounds = 3, difficulty = 'normal' } = body;

        // --- Security Validation ---
        const errors: string[] = [];

        // Validate rounds: Must be integer, 1-10 range
        if (typeof rounds !== 'number' || !Number.isInteger(rounds)) {
            errors.push('Rounds must be an integer');
        } else if (rounds < 1 || rounds > 10) {
            errors.push('Rounds must be between 1 and 10');
        }

        // Validate difficulty: Must be allowed string
        if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
            errors.push(`Difficulty must be one of: ${ALLOWED_DIFFICULTIES.join(', ')}`);
        }

        if (errors.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Validation failed', details: errors })
            };
        }
        // ---------------------------

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
            headers,
            body: JSON.stringify(battleState),
        };
    } catch (error) {
        // Log error securely (avoiding sensitive data if possible)
        console.error('Battle creation failed:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to create battle' })
        };
    }
};
