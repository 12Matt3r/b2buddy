import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { command, userId, payload } = JSON.parse(event.body || '{}');

        // Sanitize inputs to prevent Log Injection and DoS
        const cleanCommand = (typeof command === 'string' ? command : '').replace(/[\r\n]/g, '').slice(0, 100);
        const cleanUserId = (typeof userId === 'string' ? userId : '').replace(/[\r\n]/g, '').slice(0, 50);

        // Handle mobile commands like "Send Track to Deck A"
        // In a real app, this would use WebSockets (e.g. Pusher, Ably) to push to the desktop client
        console.log(`Received mobile command: ${cleanCommand} from ${cleanUserId}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Command ${cleanCommand} processed`,
                timestamp: Date.now()
            }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
