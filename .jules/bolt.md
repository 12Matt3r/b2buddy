## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-25 - Unstable Handlers Defeat React.memo
**Learning:** `React.memo` is ineffective if props (especially callbacks) are unstable. Handlers defined in parent components without `useCallback` break memoization of children.
**Action:** Wrap handlers passed to memoized components in `useCallback`. Use functional state updates (e.g., `setChannels(prev => ...)`) to remove state dependencies from these callbacks, keeping them stable.
