## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-06-25 - High-Frequency Root Updates Break Child Memoization
**Learning:** In applications with high-frequency state updates (e.g., 60fps animations or active sliders), `React.memo` on child components is ineffective unless all callbacks passed to them are also stabilized using `useCallback`.
**Action:** When implementing high-frequency controls (like crossfaders or scrubbers) in a root component, immediately identify and stabilize all callback props passed to heavy children (like Lists or Decks) to prevent cascading re-renders.
