## 2024-05-23 - [Input Validation Gap in Serverless Functions]
**Vulnerability:** The `process-interaction` Netlify function was blindly destructuring `JSON.parse` output without validation, leading to potential crashes (500 errors) or undefined behavior when processing malformed payloads.
**Learning:** Serverless functions often sit outside the main application's type safety net (tsconfig `include` usually only points to `src`), making them prone to "any" type assumptions and missing validation layers that might exist in the frontend.
**Prevention:** Always define request DTO interfaces locally within the function file (or a shared backend-only types file) and implement explicit runtime validation helpers before trusting any input.
