## 2024-05-23 - Log Injection in Serverless Functions
**Vulnerability:** User input (command, userId) was logged directly via `console.log` without sanitization, allowing attackers to inject fake log entries using newline characters (`\n`, `\r`).
**Learning:** Even simple logging statements can be a security vector. In serverless environments where logs are flattened, newlines can significantly disrupt observability and audit trails.
**Prevention:** Sanitize all user-controlled inputs before logging by replacing control characters (newlines) with safe alternatives (e.g., underscores). Enforce length limits to prevent log bloating.
