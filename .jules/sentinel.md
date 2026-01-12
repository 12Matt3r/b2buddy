## 2024-05-23 - Log Injection & DoS in Serverless Functions
**Vulnerability:** The `mobile-api` Netlify function logged user input (`command`, `userId`) directly to the console without sanitization or length limits.
**Learning:** In serverless environments, `console.log` is often the primary audit trail. Unsanitized input allows attackers to forge log entries (Log Injection) or flood logs/memory with massive payloads (DoS), masking real errors or confusing monitoring systems.
**Prevention:**
1. Always validate input types and enforce strict length limits (e.g., 100 chars).
2. Sanitize any user input before logging (e.g., replace newlines `\n` with `_`).
3. Never trust `event.body` structure; use defensive parsing and validation.