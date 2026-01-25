## 2026-01-25 - Serverless Log Injection Pattern
**Vulnerability:** `netlify/functions/mobile-api.ts` logged user-controlled inputs (`command`, `userId`) directly to `console.log` without sanitization, allowing Log Injection (CWE-117).
**Learning:** Serverless functions in this codebase (under `netlify/functions/`) are independent entry points and may lack centralized request sanitization middleware found in typical Express/server setups.
**Prevention:** Explicitly sanitize all user inputs (removing `\n`, `\r`) before logging in any serverless function. Enforce strict length limits to prevent DoS via log flooding.
