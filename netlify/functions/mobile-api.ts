import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        let { command, userId, payload } = body;

        // Security: Input Sanitization & Validation
        // 1. Sanitize to prevent Log Injection (CWE-117)
        // 2. Limit length to prevent DoS

        if (typeof command === 'string') {
            command = command.replace(/[\n\r]/g, '_').substring(0, 100);
        } else {
            command = 'unknown';
        }

        if (typeof userId === 'string') {
            userId = userId.replace(/[\n\r]/g, '_').substring(0, 50);
        } else {
            userId = 'anonymous';
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
