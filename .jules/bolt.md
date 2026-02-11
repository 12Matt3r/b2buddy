## 2024-05-24 - Expensive Derived State in Render Body
**Learning:** Derived state calculations (like array filtering/sorting) placed directly in the component body run on *every* render, even when irrelevant state changes (like switching tabs).
**Action:** Always wrap expensive derived calculations (filtering, sorting, aggregations) in `useMemo` to ensure they only run when their dependencies change. This is especially critical in components with many independent state variables (tabs, inputs, etc).

## 2024-05-24 - Animation Loop Restart on Prop Change
**Learning:** Including changing props (like opacity/volume sliders) in the dependency array of a `requestAnimationFrame` loop causes the loop to tear down and restart on every frame of the interaction, leading to micro-stutters.
**Action:** Use a `useRef` to store the latest values of these props. Update the ref in a separate `useEffect` or render body, and read from `ref.current` inside the animation loop. This allows the animation loop's `useEffect` to have an empty dependency array (or static deps), running continuously without interruption.
