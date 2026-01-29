# Sentinel Security Journal

## 2026-01-29 - Log Injection in Serverless Functions
**Vulnerability:** Unsanitized user input (`command`, `userId`) in `mobile-api.ts` was directly logged to `console.log`.
**Learning:** Serverless functions often rely on `console.log` for monitoring, making them prime targets for Log Injection (CWE-117) if input isn't sanitized. Newlines in input can forge log entries.
**Prevention:** Always sanitize inputs destined for logs by removing control characters (newlines) and enforcing length limits.
