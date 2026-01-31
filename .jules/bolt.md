## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-25 - Decoupling Animation Loops from State
**Learning:** Including frequently changing props (like opacity/volume sliders) in the dependency array of a `useEffect` that manages a `requestAnimationFrame` loop causes the loop to stop and restart on every frame, creating unnecessary overhead.
**Action:** Use a `useRef` to store the latest values of changing props. Update the ref in a separate effect, and read from the ref inside the animation loop. Keep the animation loop effect dependencies empty to ensure it runs continuously without interruption.
