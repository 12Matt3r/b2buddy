## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-25 - React.memo with unstable callbacks
**Learning:** `React.memo` is useless if props (especially event handlers) are re-created on every render. In `App.tsx`, frequent updates (like crossfader movement) cause re-renders, breaking memoization of children receiving unstable callbacks.
**Action:** Always wrap event handlers passed to memoized components in `useCallback` to ensure referential stability.
