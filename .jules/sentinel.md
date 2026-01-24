## 2026-01-24 - Netlify Function Log Injection
**Vulnerability:** Unsanitized user input in `console.log` within Netlify functions allowed Log Injection (CWE-117).
**Learning:** Serverless functions often lack the middleware layers that automatically sanitize logs in traditional servers, making manual sanitization critical.
**Prevention:** Always sanitize (remove newlines) and truncate user input before logging it in serverless handlers.
