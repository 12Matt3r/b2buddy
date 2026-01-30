# Palette's Journal - Critical UX/A11y Learnings

## 2024-05-22 - Accessibility of Hidden Actions
**Learning:** `opacity-0` and `hidden` (display: none) prevent keyboard users from accessing action buttons in lists, even if they are in the DOM. Using `group-focus-within:opacity-100` allows these actions to become visible and usable when tabbing through the interface.
**Action:** When designing "hover-only" actions, always add `group-focus-within:opacity-100` (or equivalent) to ensure keyboard accessibility. Avoid `display: none` for focusable elements unless they are truly unavailable.
