import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        // Restore payload to destructuring to prevent regression
        const { command, userId, payload } = body;

        // 1. Input Validation: Ensure strings and presence
        if (!command || typeof command !== 'string') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid command' }) };
        }
        if (!userId || typeof userId !== 'string') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid userId' }) };
        }

        // 2. Length Limits (DoS prevention)
        if (command.length > 100) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Command too long' }) };
        }
        if (userId.length > 50) {
             return { statusCode: 400, body: JSON.stringify({ error: 'UserId too long' }) };
        }

        // 3. Log Injection Prevention: Reject newlines
        // Instead of sanitizing, we reject invalid characters for stricter security
        if (/[\n\r]/.test(command) || /[\n\r]/.test(userId)) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid characters in input' }) };
        }

        // Handle mobile commands like "Send Track to Deck A"
        // In a real app, this would use WebSockets (e.g. Pusher, Ably) to push to the desktop client
        console.log(`Received mobile command: ${command} from ${userId}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Command ${command} processed`,
                timestamp: Date.now()
            }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
