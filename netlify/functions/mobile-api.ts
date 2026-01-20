import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { command, userId, payload } = JSON.parse(event.body || '{}');

        // SECURITY: Validate inputs to prevent Log Injection and DoS
        // 1. Ensure strings
        // 2. Truncate to reasonable length
        // 3. Remove newlines/carriage returns

        const safeCommand = (typeof command === 'string' ? command : String(command || ''))
            .substring(0, 100)
            .replace(/[\n\r]/g, '_');

        const safeUserId = (typeof userId === 'string' ? userId : String(userId || ''))
            .substring(0, 50)
            .replace(/[\n\r]/g, '_');

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
