## 2023-10-27 - Render Loop Dependency Trap
**Learning:** Including rapidly changing props (like opacity/volume) in a `useEffect` dependency array that manages a `requestAnimationFrame` loop causes the loop to destroy and recreate constantly, killing performance.
**Action:** Use a `useRef` to store the latest prop values and read from them inside the loop, keeping the effect dependencies stable.
