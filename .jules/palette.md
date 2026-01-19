## 2026-01-19 - Core Controls Accessibility Gap
**Learning:** Core interactive components like `DJDeck` completely lacked ARIA labels and keyboard focus states, making the app unusable for screen reader and keyboard-only users.
**Action:** When auditing new components, immediately check icon-only buttons and custom sliders for `aria-label` and `focus-visible` styles.
