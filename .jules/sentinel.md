## 2024-05-24 - Log Injection in Mobile API
**Vulnerability:** The `mobile-api` Netlify function was logging user input (`command`, `userId`) directly to the console without sanitization. This allowed for Log Injection (CWE-117), where an attacker could inject fake log entries by including newline characters in the input.
**Learning:** Even internal logging of user actions must be sanitized. Serverless functions are particularly vulnerable as logs are often the primary observability tool. Newline characters (`\n`, `\r`) in user input are the mechanism for this attack.
**Prevention:** Always sanitize user input before logging. Specifically, replace newline characters with a safe alternative (like underscores or `[newline]`). Also, enforce length limits to prevent log flooding (DoS).
