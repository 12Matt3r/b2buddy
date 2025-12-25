# Bolt's Journal

## 2024-05-23 - React State in Render Loops
**Learning:** Using React state or props as dependencies in a `useEffect` based animation loop (requestAnimationFrame) causes the loop to tear down and restart on every update. This is a performance bottleneck for high-frequency updates like sliders.
**Action:** Use `useRef` to store mutable values (`opacity`, `mixBlendMode`, etc.) and read them inside the loop. Keep the loop's dependency array empty (or stable).
