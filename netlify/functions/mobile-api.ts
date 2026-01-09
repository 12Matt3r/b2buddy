import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!event.body) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing request body' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { command, userId, payload } = body;

    // VALIDATION: Check required fields and types
    if (typeof command !== 'string' || typeof userId !== 'string') {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input: command and userId must be strings' }) };
    }

    // VALIDATION: Length limits to prevent DoS/Log spam
    if (command.length > 100 || userId.length > 50) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input: Length limit exceeded' }) };
    }

    // SANITIZATION: Prevent Log Injection (CWE-117)
    // Replace newlines with underscores to ensure log integrity
    const safeCommand = command.replace(/[\n\r]/g, '_');
    const safeUserId = userId.replace(/[\n\r]/g, '_');

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
};
