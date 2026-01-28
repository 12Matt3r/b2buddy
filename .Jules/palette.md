## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons are a common pattern for dense interfaces like DJ tools, but they create a significant barrier for screen reader users and new users if not properly labeled.
**Action:** When using icon-only buttons for navigation, always wrap them in a semantic `role="tablist"` container and apply `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes. The `title` attribute provides a native tooltip for mouse users, while `aria-label` serves screen readers.

## 2024-05-24 - Canvas Visualization Accessibility
**Learning:** Canvas elements used for visualizations (like waveforms) are invisible to screen readers unless explicitly given a role and label.
**Action:** Always add `role="img"` and a descriptive `aria-label` to canvas elements that convey meaningful information.
