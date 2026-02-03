import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { command, userId, payload } = JSON.parse(event.body || '{}');

        // Security: Input Validation
        if (typeof command !== 'string' || typeof userId !== 'string') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input format' }) };
        }

        // Security: Sanitization (prevent Log Injection)
        const safeCommand = command.replace(/[\n\r]/g, '').slice(0, 100);
        const safeUserId = userId.replace(/[\n\r]/g, '').slice(0, 50);

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
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
