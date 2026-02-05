import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        let { command, userId, payload } = body;

        // Security: Input Validation
        if (typeof command !== 'string' || typeof userId !== 'string') {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input format. command and userId must be strings.' }) };
        }

        // Security: DoS Prevention (Length Limits)
        if (command.length > 100) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Command too long (max 100 chars)' }) };
        }
        if (userId.length > 50) {
            return { statusCode: 400, body: JSON.stringify({ error: 'UserId too long (max 50 chars)' }) };
        }

        // Security: Log Injection Prevention (Sanitization)
        // Remove newlines and carriage returns to prevent log forging
        command = command.replace(/[\r\n]+/g, '');
        userId = userId.replace(/[\r\n]+/g, '');

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
