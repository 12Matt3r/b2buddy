## 2024-05-23 - Netlify Function Input Validation
**Vulnerability:** Netlify functions (`mobile-api.ts`) were manually parsing `event.body` without validating input types, lengths, or content, leading to Log Injection and potential DoS.
**Learning:** Netlify functions in this project lack a shared middleware for input validation, requiring manual validation in each handler.
**Prevention:** Implement strict input validation (type, length, sanitization) at the beginning of every Netlify function handler or introduce a shared validation middleware.
