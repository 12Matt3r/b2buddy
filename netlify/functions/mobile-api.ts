import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { command, userId } = body;

        // Input Validation
        if (!command || typeof command !== 'string') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid command format' }) };
        }
        if (!userId || typeof userId !== 'string') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid userId format' }) };
        }

        // Length Limits (DoS prevention)
        if (command.length > 100) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Command too long' }) };
        }
        if (userId.length > 50) {
            return { statusCode: 400, body: JSON.stringify({ error: 'UserId too long' }) };
        }

        // Sanitize for Logging (Log Injection Prevention)
        const safeCommand = command.replace(/[\n\r]/g, '_');
        const safeUserId = userId.replace(/[\n\r]/g, '_');

        // Handle mobile commands like "Send Track to Deck A"
        // In a real app, this would use WebSockets (e.g. Pusher, Ably) to push to the desktop client
        console.log(`Received mobile command: ${safeCommand} from ${safeUserId}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Command ${safeCommand} processed`,
                timestamp: Date.now()
            }),
        };
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }
};
