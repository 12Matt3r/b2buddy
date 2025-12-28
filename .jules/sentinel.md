## 2025-05-23 - Missing Input Validation in Serverless Functions
**Vulnerability:** The `create-battle` Netlify function accepted arbitrary input for `rounds` and `difficulty` parameters, relying only on default values if keys were missing.
**Learning:** Even in mocked or "simple" backend functions, lack of input validation can lead to invalid application states, potential DoS (e.g. requesting 1 million rounds), or type confusion.
**Prevention:** Always implement strict input validation at the API boundary (Netlify functions), ensuring types, ranges, and allowed values are checked before processing logic.
