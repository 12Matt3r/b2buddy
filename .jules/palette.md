## 2024-05-24 - Accessibility in Reusable Components
**Learning:** Reusable components rendered multiple times (like DJ decks) create duplicate IDs if hardcoded, breaking accessibility associations (WCAG 4.1.1).
**Action:** Use React's `useId` hook to generate stable, unique IDs for internal form controls, ensuring valid `htmlFor` and `aria-labelledby` associations across all component instances.
