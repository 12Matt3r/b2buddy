## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons are a common pattern for dense interfaces like DJ tools, but they create a significant barrier for screen reader users and new users if not properly labeled.
**Action:** When using icon-only buttons for navigation, always wrap them in a semantic `role="tablist"` container and apply `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes. The `title` attribute provides a native tooltip for mouse users, while `aria-label` serves screen readers.

## 2024-05-24 - Reveal-on-Focus for List Actions
**Learning:** Hiding secondary actions (like "Load Track") until hover keeps the UI clean but breaks accessibility for keyboard users if they are `display: none` or purely opacity-based without focus handling.
**Action:** Use `group-focus-within:opacity-100` alongside `group-hover:opacity-100` to ensure actions become visible when a user tabs into the row. Avoid `display: none` (hidden) for focusable elements; use `opacity-0` so they remain in the tab order.
