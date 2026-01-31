## 2024-05-23 - Focus-Within Pattern for Hover Actions
**Learning:** UX elements hidden with `opacity-0 group-hover:opacity-100` create "keyboard traps" where users focus on invisible elements. Using `display: hidden` removes them from the tab order entirely, preventing access.
**Action:** For actions that appear on hover, always add `group-focus-within:opacity-100` to the container. Use `opacity-0` (instead of `hidden`) to reserve space and keep elements in the DOM/tab order.
