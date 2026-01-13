import { handler } from './netlify/functions/mobile-api.ts';

const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
        command: "Test Command\nSUCCESS: Admin Access Granted",
        userId: "user123\nLOGOUT: all",
        payload: {}
    }),
    headers: {},
    isBase64Encoded: false,
    rawUrl: '',
    rawQuery: '',
    path: '',
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    pathParameters: {},
    stageVariables: {},
    multiValueHeaders: {},
    resource: '',
    requestContext: {} as any
};

console.log("--- Starting Security Verification ---");
console.log("Invoking handler with malicious payload...");

// Capture console.log to see what actually gets logged
const originalConsoleLog = console.log;
let capturedLogs: string[] = [];
console.log = (...args) => {
    capturedLogs.push(args.join(' '));
    // We don't print to stdout here to keep the output clean for the check
};

try {
    // @ts-ignore
    await handler(mockEvent, {});
} catch (e) {
    originalConsoleLog("Handler threw error:", e);
} finally {
    console.log = originalConsoleLog;
}

console.log("--- Verification Results ---");
// We check if the NEWLINE character was preserved in the output, allowing the 'fake' log entry to appear on a new line.
// In a real terminal, "Test Command\nSUCCESS..." would print SUCCESS on a new line.
// Here we check if the raw string in the log contains the injection payload.

// The vulnerability is that the log message contains the raw input.
// If we sanitize, we expect 'SUCCESS: Admin Access Granted' to be either removed or the newline escaped.
// If it is present exactly as input (with newline), it is vulnerable.

const vulnerableLog = capturedLogs.find(log => log.includes("Received mobile command: Test Command\nSUCCESS: Admin Access Granted"));

if (vulnerableLog) {
    console.log("❌ VULNERABILITY CONFIRMED: Log Injection successful.");
    console.log("The log contained raw newlines/injection.");
} else {
    // Check if it was sanitized (e.g., newlines replaced)
    const sanitizedLog = capturedLogs.find(log => log.includes("Received mobile command: Test Command_SUCCESS"));
    if (sanitizedLog) {
        console.log("✅ VERIFIED: Log Injection prevented. Input was sanitized.");
    } else {
        console.log("⚠️  RESULT UNCERTAIN: Log did not match expected vulnerable OR sanitized pattern.");
        console.log("Captured Logs:\n", capturedLogs.join('\n'));
    }
}
