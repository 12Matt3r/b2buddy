## 2024-02-14 - VJRenderer WebGL Loop Optimization
**Learning:** React `useEffect` with `requestAnimationFrame` often triggers unnecessary tear-down/re-setup of the loop when props change. For values updated rapidly (like sliders/knobs), this causes performance issues.
**Action:** Use a `ref` to store current prop values. Update the `ref` in a separate `useEffect` or via handlers. The animation loop should depend on *stable* references (or just run once on mount) and read from the `ref.current` inside the frame callback. This decouples the render loop frequency from the React render cycle.
