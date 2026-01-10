# Sentinel Journal

## 2024-05-24 - Initial Setup
**Status:** Initialized security tracking.
**Policy:** Critical learnings only.

## 2024-05-24 - Log Injection in Serverless Functions
**Vulnerability:** User input (`command`, `userId`) was logged directly to the console in `mobile-api.ts`.
**Learning:** Even in serverless environments where logs are aggregated, attackers can forge log entries (Log Injection CWE-117) by injecting newline characters, potentially confusing log parsers or hiding malicious activity.
**Prevention:** Always sanitize user input before logging by replacing control characters (like `\n`, `\r`) with safe alternatives (like `_`). Also, enforce strict length limits to prevent log flooding.
