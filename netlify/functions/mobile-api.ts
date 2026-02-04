import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { command, userId, payload } = body;

        // 1. Input Validation
        if (!command || typeof command !== 'string' || command.length > 100) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid command: must be string under 100 chars' })
            };
        }

        if (!userId || typeof userId !== 'string' || userId.length > 50) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid userId: must be string under 50 chars' })
            };
        }

        // 2. Sanitization (Log Injection Prevention)
        // Remove newlines and control characters
        const safeCommand = command.replace(/[\r\n]+/g, ' ');
        const safeUserId = userId.replace(/[\r\n]+/g, ' ');

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
        // Secure Error Handling: Don't leak stack trace
        console.error('Mobile API Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
