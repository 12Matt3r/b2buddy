## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-25 - High-Frequency Parent Updates require Strict Memoization
**Learning:** In apps with high-frequency state updates (e.g., 60fps animations or sliders in `App.tsx`), `React.memo` on children is useless if callbacks passed to them are not stabilized with `useCallback`. Even a single unstable prop breaks memoization.
**Action:** When a parent component manages high-frequency state (like audio levels or crossfader), aggressively `memo` child components that don't depend on that state, and ensure ALL their props (especially event handlers) are wrapped in `useCallback` or `useMemo`.
