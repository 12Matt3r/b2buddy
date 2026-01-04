## 2024-05-24 - Log Injection in Mobile API
**Vulnerability:** Log Injection (CWE-117) was found in `netlify/functions/mobile-api.ts`. User-supplied `command` and `userId` were logged directly to the console without sanitization, allowing attackers to inject newline characters and forge log entries.
**Learning:** Netlify Functions are server-side code and must treat all input (body, headers, query params) as untrusted, just like any other backend. Even simple `console.log` statements can be vulnerabilities if input isn't sanitized.
**Prevention:** Always sanitize or encode user input before logging. For logs, replacing newlines (`\n`, `\r`) with underscores or escapes is a standard mitigation.
