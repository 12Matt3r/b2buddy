## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-24 - High-Frequency Parent Updates
**Learning:** In apps with high-frequency parent state updates (like 60fps sliders/animations in `App.tsx`), static child components (like `Library`, `DrumRack`) will re-render unnecessarily unless explicitly memoized.
**Action:** Wrap heavy, static UI components in `React.memo` and stabilize their callback props using `useCallback` in the parent. This isolates them from unrelated high-frequency updates.
