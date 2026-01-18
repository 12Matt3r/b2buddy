## 2024-05-24 - Log Injection in Netlify Functions
**Vulnerability:** Input fields (`command`, `userId`) in `mobile-api.ts` were logged directly without sanitization, allowing attackers to inject fake log entries via newline characters (CWE-117).
**Learning:** Serverless functions often lack the default middleware protections found in frameworks like Express, requiring manual input sanitization for every handler.
**Prevention:** Always sanitize inputs destined for logs by removing/replacing newline characters (`\n`, `\r`) and enforcing length limits to prevent DoS.
