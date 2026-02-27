## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-24 - WebGL Animation Loops and React Dependency Arrays
**Learning:** Including frequently changing props (like opacity or crossfader values) in the `useEffect` dependency array of a `requestAnimationFrame` loop causes the loop to be torn down and restarted on every frame, leading to performance stuttering.
**Action:** Use a `useRef` to store the latest values of these props (`latestProps.current`) and read from this ref inside the animation loop. This allows the `useEffect` dependency array to be empty (or static), ensuring the loop persists smoothly while still accessing up-to-date state.
