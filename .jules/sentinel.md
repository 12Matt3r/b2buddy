## 2024-05-24 - Netlify Function Input Validation
**Vulnerability:** The Netlify function `process-interaction.ts` processes user input (`event.body`) without validating that the `interaction` object or its properties exist or have the correct types. This could lead to 500 errors or potentially unexpected behavior if malformed data is sent.
**Learning:** Serverless functions, even simple ones, must treat all input as untrusted. Assuming the frontend always sends correct data is a common pitfall.
**Prevention:** Always validate the structure and types of the request body before using it. Return 400 Bad Request for invalid input to distinguish client errors from server errors.
