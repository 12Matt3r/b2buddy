## 2024-05-23 - Regression in Security Controls
**Vulnerability:** Log Injection (CWE-117) in `mobile-api.ts`.
**Learning:** The codebase contained a regression where input sanitization described in documentation/memory was missing in the actual code.
**Prevention:** Always verify security controls in the actual source code, do not rely solely on documentation or memory. Automated security tests should be added to CI to prevent regressions.
