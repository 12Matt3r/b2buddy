import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        // Sanitize inputs to prevent Log Injection (CWE-117) and enforce length limits
        const command = String(body.command || '').slice(0, 100).replace(/[\r\n]/g, '_');
        const userId = String(body.userId || '').slice(0, 50).replace(/[\r\n]/g, '_');

        // Payload is passed through but not logged
        const payload = body.payload || {};

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
        // Secure error handling: Don't expose internal errors
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
