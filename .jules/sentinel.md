## 2024-05-22 - Log Injection in Serverless Functions
**Vulnerability:** User input (`command`, `userId`) was logged directly to stdout in Netlify functions, allowing attackers to inject fake log entries via newline characters.
**Learning:** Serverless environments often rely on stdout/stderr for logging, making them susceptible to Log Injection if input isn't sanitized, potentially misleading monitoring systems.
**Prevention:** Always sanitize user input (strip/replace newlines) before passing it to logging functions.
