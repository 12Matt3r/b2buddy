## 2024-05-24 - Log Injection in Mobile API
**Vulnerability:** The `mobile-api` Netlify function logged user input (`command` and `userId`) directly to the console without sanitization. This allowed for Log Injection (CWE-117), where an attacker could inject fake log entries (e.g., "[CRITICAL] Admin access granted") by using newline characters in the input.
**Learning:** Even in serverless functions or "mock" APIs, `console.log` is a security vector if the logs are aggregated or viewed by humans. Simple newline characters can disrupt log analysis or forge audit trails.
**Prevention:** Always sanitize user input before logging. Specifically, replace newline characters (`\n`, `\r`) with safe placeholders (like `_` or ` `) and enforce length limits to prevent DoS via log flooding.
