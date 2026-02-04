## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-25 - Unnecessary Component Re-renders from Frequent Parent Updates
**Learning:** `App.tsx` manages high-frequency state (crossfader, channel levels) alongside static UI components (`Library`, `DrumRack`). Without `React.memo` and stable callbacks (`useCallback`), these static components re-render on every animation frame of a mix, causing significant CPU overhead.
**Action:** Isolate high-frequency state updates from static UI. Use `React.memo` for "heavy" static panels and ensure all callbacks passed to them are stabilized with `useCallback`.
