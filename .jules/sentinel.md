## 2026-02-02 - Log Injection in Serverless Functions
**Vulnerability:** Found `console.log` statements in `netlify/functions/mobile-api.ts` effectively taking raw user input (`command`, `userId`) and interpolating it into logs. This allows attackers to forge log entries (CWE-117) by injecting newline characters.
**Learning:** Serverless functions often lack shared middleware for input sanitization, leading to developers directly trusting `event.body`.
**Prevention:** Sanitize all user inputs (specifically removing `\n` and `\r`) before logging them. Enforce strict length limits on inputs to prevent DoS via log flooding.
