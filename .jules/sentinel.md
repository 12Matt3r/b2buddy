## 2024-03-24 - Netlify Function Log Injection Pattern
**Vulnerability:** Serverless functions (e.g., `mobile-api.ts`) were directly logging unsanitized user inputs (`command`, `userId`).
**Learning:** The project uses `console.log` in Netlify functions which are ingested by cloud logging services. Direct logging of `event.body` properties allows Log Injection (CWE-117) and potentially obscures real logs or injects fake ones.
**Prevention:** All user inputs in Netlify functions must be sanitized (newlines removed) and truncated before logging. Use a structured logger if possible, or a helper function for safe logging.
