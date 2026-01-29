## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons are a common pattern for dense interfaces like DJ tools, but they create a significant barrier for screen reader users and new users if not properly labeled.
**Action:** When using icon-only buttons for navigation, always wrap them in a semantic `role="tablist"` container and apply `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes. The `title` attribute provides a native tooltip for mouse users, while `aria-label` serves screen readers.

## 2024-05-24 - Dynamic ARIA Labels for Toggle Controls
**Learning:** For toggle buttons (like Play/Pause) where the icon changes, the `aria-label` must also dynamically reflect the *current* state (e.g., "Pause Deck 1") rather than a generic "Play/Pause" label. This ensures screen reader users know exactly what action will happen next.
**Action:** Use ternary operators in `aria-label` props for state-dependent controls: `aria-label={isPlaying ? 'Pause' : 'Play'}`. Pair with `title` for visual tooltips.
