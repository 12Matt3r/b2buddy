## 2026-01-28 - Serverless Input Validation Gaps
**Vulnerability:** Multiple Netlify functions (`mobile-api.ts`, `create-battle.ts`) parsed JSON input and accessed properties without type checking, existence validation, or sanitization.
**Learning:** The project relies on manual input parsing in each handler without a shared validation middleware, leading to inconsistent security postures (e.g., Log Injection in `mobile-api`).
**Prevention:** Implement a shared validation utility or middleware for all Netlify functions to enforce type safety and input sanitization before the handler logic executes.
