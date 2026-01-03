## 2024-05-24 - Log Injection in Mobile API
**Vulnerability:** Log Injection (CWE-117)
**Learning:** `netlify/functions/mobile-api.ts` logged user-controlled inputs (`command` and `userId`) directly to the console. This allowed attackers to inject newlines and forge log entries, potentially masking malicious activity or confusing log parsers.
**Prevention:** Always sanitize user inputs before logging. Specifically, strip or replace newline characters (`\n`, `\r`) to ensure one log entry corresponds to one actual event. Used `String(input).replace(/[\n\r]/g, '_')` to sanitize.
