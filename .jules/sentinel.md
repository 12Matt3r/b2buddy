# Sentinel's Journal

## 2024-05-22 - Log Injection Vulnerability in Serverless Functions
**Vulnerability:** Found `console.log` directly outputting user-controlled input (`command`, `userId`) in `mobile-api.ts`.
**Learning:** Serverless functions often have less visible logs to developers during dev, making log injection easier to miss. Direct logging of `event.body` content without sanitization allows attackers to forge log entries.
**Prevention:** Always sanitize input (strip newlines/control characters) before logging. Use structured logging where possible.
