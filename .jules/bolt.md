## 2024-05-22 - Performance Optimization
**Learning:** React functional updates for state (e.g., setChannels(prev => ...)) are crucial for optimizing useCallback dependencies. By removing the state variable from the dependency array, we prevent the callback from being recreated on every state change, which is essential for effective memoization of child components.
**Action:** Always prefer functional state updates when the new state depends on the previous state, especially in handlers passed to memoized children.
