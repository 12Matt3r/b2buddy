import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        let { command, userId, payload } = body;

        // Input Validation
        if (!command || typeof command !== 'string') {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing or invalid command' }) };
        }
        if (!userId || typeof userId !== 'string') {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing or invalid userId' }) };
        }

        // Length Limits (DoS prevention)
        if (command.length > 100) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Command too long (max 100 chars)' }) };
        }
        if (userId.length > 50) {
            return { statusCode: 400, body: JSON.stringify({ error: 'UserId too long (max 50 chars)' }) };
        }

        // Sanitization (Log Injection prevention)
        // Remove newlines and other control characters to prevent log forging
        const sanitizedCommand = command.replace(/[\n\r]/g, '_');
        const sanitizedUserId = userId.replace(/[\n\r]/g, '_');

        // Handle mobile commands like "Send Track to Deck A"
        // In a real app, this would use WebSockets (e.g. Pusher, Ably) to push to the desktop client
        console.log(`Received mobile command: ${sanitizedCommand} from ${sanitizedUserId}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Command ${sanitizedCommand} processed`,
                timestamp: Date.now()
            }),
        };
    } catch (error) {
        // Safe error logging (avoid leaking sensitive info in logs if possible, or at least structure it)
        console.error('Mobile API Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
