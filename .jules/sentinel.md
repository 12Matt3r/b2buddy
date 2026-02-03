## 2023-10-27 - Log Injection in Serverless Functions
**Vulnerability:** User input (`command`, `userId`) was logged directly to stdout without sanitization in `mobile-api.ts`.
**Learning:** Serverless functions often treat `console.log` as the primary logging mechanism. Developers might forget that these logs are often aggregated and viewable in dashboards where newline characters can be used to spoof log entries.
**Prevention:** Always sanitize input before logging. Specifically strip `\n` and `\r` characters from user-controlled strings before passing them to `console.log`.
