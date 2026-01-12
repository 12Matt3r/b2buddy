## 2024-05-23 - Log Injection in Mobile API
**Vulnerability:** The `mobile-api` Netlify function logged `command` and `userId` directly from user input without sanitization. This allowed attackers to inject newlines and forge log entries (CWE-117).
**Learning:** Serverless functions often treat logs as the primary debugging tool. Trusting user input in `console.log` can mislead developers or monitoring systems.
**Prevention:** Always sanitize input before logging. Specifically, strip newline characters (`\n`, `\r`) from user-controlled strings to prevent log forging. Added strict type checks and length limits as defense-in-depth.
