## 2023-10-27 - Log Injection in Serverless Functions
**Vulnerability:** Unsanitized user input (`command`, `userId`) was directly logged to stdout in `mobile-api`, allowing attackers to forge log entries (CWE-117).
**Learning:** Serverless functions often lack the middleware layers that automatically handle logging security in traditional frameworks, making explicit sanitization necessary.
**Prevention:** Always sanitize user input before logging (replace newlines/control chars) and enforce strict length limits to prevent DoS via logs.
