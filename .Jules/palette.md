## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons are a common pattern for dense interfaces like DJ tools, but they create a significant barrier for screen reader users and new users if not properly labeled.
**Action:** When using icon-only buttons for navigation, always wrap them in a semantic `role="tablist"` container and apply `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes. The `title` attribute provides a native tooltip for mouse users, while `aria-label` serves screen readers.

## 2024-05-24 - Hover-only Actions & Keyboard Accessibility
**Learning:** Using `opacity-0 group-hover:opacity-100` or `hidden group-hover:flex` to hide secondary actions creates a clean UI but completely excludes keyboard users.
**Action:** Always pair `group-hover:opacity-100` with `group-focus-within:opacity-100` (and ensure the container stays in the DOM) so that tabbing into the container reveals the actions. Also, ensure hidden actions have distinct `aria-label`s since context (like row position) might be less obvious when navigating quickly.
