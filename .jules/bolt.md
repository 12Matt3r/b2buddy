## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-25 - Stabilizing Callbacks for Memoization
**Learning:** In applications with high-frequency state updates (e.g., 60fps animations or active sliders), `React.memo` on child components is ineffective unless all callbacks passed to them are also stabilized using `useCallback`.
**Action:** When optimizing performance in a parent component that drives high-frequency updates, always audit passed props and wrap functions in `useCallback` before applying `React.memo` to children.
