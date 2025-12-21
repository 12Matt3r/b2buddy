## 2024-05-22 - Serverless Input Validation
**Vulnerability:** Netlify Functions parsed JSON bodies directly without type checking or existence checks, causing 500 errors on malformed input and exposing log injection risks.
**Learning:** Even in mock/prototype backends, lack of validation sets a dangerous precedent and can leak into production mental models.
**Prevention:** Always validate existence and type of expected payload properties before usage. Sanitize inputs before logging.
