## 2024-05-23 - Log Injection in Serverless Functions
**Vulnerability:** `console.log` directly logging user input (`command`, `userId`) allowed attackers to inject fake log entries (CWE-117) by including newline characters in the input.
**Learning:** Serverless functions often rely on standard output for logging, where newline characters are interpreted as new log entries by log aggregators. This is easily overlooked when using `console.log`.
**Prevention:** Always sanitize user input by removing or replacing control characters (especially `\n` and `\r`) before logging, or use a structured logging library that handles escaping automatically.
