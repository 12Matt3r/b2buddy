## 2024-05-23 - Serverless Function Input Validation
**Vulnerability:** Unvalidated inputs in `mobile-api.ts` allowed for potential Log Injection (newlines in logs) and Denial of Service (DoS) via large payloads.
**Learning:** Serverless functions are publicly accessible endpoints. The absence of middleware (common in Express/NestJS) often leads to developers skipping manual validation, assuming the inputs are "safe" or "internal".
**Prevention:** Implement strict input validation (type, length, content) at the very beginning of every handler. Use libraries like Zod or Joi if the schema is complex, or manual checks for simple cases. Sanitize any user input before logging it.
