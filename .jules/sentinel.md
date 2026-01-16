## 2024-05-21 - Log Injection in Serverless Functions
**Vulnerability:** `mobile-api.ts` logged user input (`command` and `userId`) directly without sanitization, allowing attackers to forge log entries using newline characters (CWE-117).
**Learning:** Even in simple serverless functions, logging user input is risky. `console.log` in Node.js/Netlify treats newlines literally, which can disrupt log analysis or be used to spoof events.
**Prevention:** Always sanitize user input before logging (replace newlines) and enforce length limits. Use structured logging where possible, but manual sanitization is a minimum.
