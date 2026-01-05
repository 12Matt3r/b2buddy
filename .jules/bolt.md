# Bolt's Journal - Critical Learnings

## 2024-05-24 - Initial Setup
**Learning:** Performance tracking requires a dedicated journal to avoid repeating mistakes.
**Action:** Created this journal to track critical performance learnings.

## 2024-05-24 - WebGL Render Loop Restarting
**Learning:** In `VJRenderer.tsx`, the `requestAnimationFrame` loop was inside a `useEffect` that depended on rapidly changing props (opacity, blend mode). This caused the loop to be torn down and recreated on every frame of a fade, decoupling the visual framerate from the display refresh rate and adding overhead.
**Action:** Use the `useRef` pattern to store mutable props and read them inside a stable `useEffect` loop that only runs on mount/unmount.
