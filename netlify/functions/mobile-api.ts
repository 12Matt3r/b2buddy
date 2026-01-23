import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        let { command, userId, payload } = JSON.parse(event.body || '{}');

        // Input Validation
        if (typeof command !== 'string' || typeof userId !== 'string') {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input: command and userId must be strings' }) };
        }

        // Security: Sanitize input to prevent Log Injection and DoS
        command = command.replace(/[\n\r]/g, '_').slice(0, 100);
        userId = userId.replace(/[\n\r]/g, '_').slice(0, 50);

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
