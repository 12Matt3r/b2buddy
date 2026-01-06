import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const command = body.command;
        const userId = body.userId;
        // payload is optional

        if (typeof command !== 'string' || typeof userId !== 'string') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input: command and userId must be strings' })
            };
        }

        // Sanitize inputs to prevent Log Injection
        // Replace newlines with underscores
        const safeCommand = command.replace(/[\r\n]+/g, '_').substring(0, 100);
        const safeUserId = userId.replace(/[\r\n]+/g, '_').substring(0, 50);

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
