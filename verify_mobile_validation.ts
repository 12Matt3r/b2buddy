import { handler } from './netlify/functions/mobile-api.ts';

const testCases = [
    {
        name: "Invalid Type (command is number)",
        body: { command: 123, userId: "validUser" },
        expectedStatus: 400
    },
    {
        name: "Invalid Type (userId is object)",
        body: { command: "validCommand", userId: {} },
        expectedStatus: 400
    },
    {
        name: "Length Exceeded (command > 100)",
        body: { command: "a".repeat(101), userId: "validUser" },
        expectedStatus: 400
    },
    {
        name: "Length Exceeded (userId > 50)",
        body: { command: "validCommand", userId: "a".repeat(51) },
        expectedStatus: 400
    },
    {
        name: "Valid Input",
        body: { command: "validCommand", userId: "validUser" },
        expectedStatus: 200
    }
];

console.log("--- Starting Validation Verification ---");

let allPassed = true;

for (const test of testCases) {
    const mockEvent = {
        httpMethod: 'POST',
        body: JSON.stringify(test.body),
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

    try {
        // @ts-ignore
        const result = await handler(mockEvent, {});

        if (result.statusCode === test.expectedStatus) {
            console.log(`✅ ${test.name}: Passed (Got ${result.statusCode})`);
        } else {
            console.log(`❌ ${test.name}: Failed (Expected ${test.expectedStatus}, Got ${result.statusCode})`);
            allPassed = false;
        }
    } catch (e) {
        console.log(`❌ ${test.name}: Error thrown`, e);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("--- All Validation Tests Passed ---");
} else {
    console.log("--- Some Validation Tests Failed ---");
    process.exit(1);
}
