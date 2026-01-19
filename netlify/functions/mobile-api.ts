import { Handler } from '@netlify/functions';

const sanitizeInput = (input: unknown, maxLength: number): string => {
    if (typeof input !== 'string') return '';
    // Replace control characters (newlines, etc.) with underscore to prevent Log Injection
    return input.replace(/[\x00-\x1F\x7F]/g, '_').substring(0, maxLength);
};

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        let { command, userId } = body;

        // Input Validation
        if (!command || !userId) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
        }

        // Sanitization
        command = sanitizeInput(command, 100);
        userId = sanitizeInput(userId, 50);

        if (command.length === 0 || userId.length === 0) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input format' }) };
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
        // Securely log the error internally without exposing it to the user
        console.error('Mobile API Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
