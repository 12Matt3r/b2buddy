import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    try {
        const payload = JSON.parse(event.body);
        const { command, userId, payload: cmdPayload } = payload;

        // Security Validation
        if (!command || typeof command !== 'string' || command.length > 50) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or missing command' }) };
        }
        if (!userId || typeof userId !== 'string' || userId.length > 50) {
             return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or missing userId' }) };
        }

        // Sanitize for log injection (basic)
        const safeCommand = command.replace(/[\n\r]/g, '');
        const safeUserId = userId.replace(/[\n\r]/g, '');

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
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON format or request processing failed' }) };
    }
};
