## 2024-05-23 - React Effect Dependencies & Animation Loops
**Learning:** Putting high-frequency props (like opacity sliders) in `useEffect` dependency arrays that manage `requestAnimationFrame` loops is a performance killer. It causes the loop to be torn down and recreated on every frame, leading to jank.
**Action:** Use `useRef` to store latest props and read from the ref inside the loop, keeping the dependency array empty or stable.
