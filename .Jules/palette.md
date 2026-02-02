## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons are a common pattern for dense interfaces like DJ tools, but they create a significant barrier for screen reader users and new users if not properly labeled.
**Action:** When using icon-only buttons for navigation, always wrap them in a semantic `role="tablist"` container and apply `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes. The `title` attribute provides a native tooltip for mouse users, while `aria-label` serves screen readers.

## 2026-02-02 - Accessible Hover Actions
**Learning:** Using `opacity-0` with `group-hover:opacity-100` hides actions from keyboard users. Adding `group-focus-within:opacity-100` ensures these actions become visible when a user tabs into the container.
**Action:** Always pair `group-hover` visibility toggles with `group-focus-within` (or `focus-within`) to maintain accessibility for keyboard navigation.
