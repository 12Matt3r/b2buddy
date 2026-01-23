## 2024-05-23 - Serverless Input Validation & Log Injection
**Vulnerability:** Found Log Injection (CWE-117) and potential DoS via unbounded string inputs in Netlify functions.
**Learning:** Serverless functions often accept raw JSON payloads without the middleware protection found in frameworks like Express, making them susceptible to injection attacks if inputs (especially for logs) are not explicitly sanitized.
**Prevention:** Always sanitize user inputs before logging (replace newlines) and enforce strict length limits on string parameters in serverless handlers.
