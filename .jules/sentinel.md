## 2024-05-23 - Log Injection in Netlify Functions
**Vulnerability:** The `mobile-api.ts` function logged user input (`command`, `userId`) directly without sanitization, allowing for Log Injection (CWE-117) where attackers could forge log entries using newline characters.
**Learning:** In this serverless architecture, input validation logic is scattered across individual handlers rather than centralized in middleware, increasing the risk of missing sanitization in new functions.
**Prevention:** Implement a shared validation/sanitization utility or middleware for all Netlify functions to ensure consistent input handling before processing or logging.
