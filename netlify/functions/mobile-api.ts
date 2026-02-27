import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        let { command, userId, payload } = body;

        // Security: Input Validation & Sanitization
        // Ensure inputs are strings to prevent type errors
        if (typeof command !== 'string') command = String(command || '');
        if (typeof userId !== 'string') userId = String(userId || 'anonymous');

        // Prevent Log Injection (CWE-117) by removing newlines
        // Enforce length limits to prevent DoS (100 chars for command, 50 for userId)
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
        // Log the error securely (avoid leaking stack traces to user, but log internal error if needed)
        console.error('Mobile API Error processing request');
        return { statusCode: 500, body: JSON.stringify({ error: 'Mobile API Error' }) };
    }
};
