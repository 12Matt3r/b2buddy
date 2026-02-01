## 2024-05-22 - Log Injection in Serverless Functions
**Vulnerability:** The `mobile-api.ts` function logged user input (`command` and `userId`) directly to `console.log` without sanitization.
**Learning:** Serverless functions often log to centralized systems (CloudWatch, Datadog) where newline characters (`\n`, `\r`) can be used to forge log entries, confusing monitoring tools or hiding malicious activity (CWE-117).
**Prevention:** Always sanitize user input before logging. Use a utility function to strip newlines or use structured logging (JSON) which handles escaping automatically.
