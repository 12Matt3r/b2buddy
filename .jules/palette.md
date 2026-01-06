## 2024-05-23 - Dynamic Labels for Toggle Buttons
**Learning:** Toggle buttons (like Play/Pause) must have dynamic `aria-label`s that reflect the *current* action (e.g., "Pause" when playing), not just the button's name.
**Action:** Always check boolean state in `aria-label` for icon-only toggle buttons.

## 2024-05-23 - Canvas Accessibility
**Learning:** Decorative canvases used for visualizers should be explicitly marked as `role="img"` with a descriptive label to explain the "empty" space to screen readers.
**Action:** Add `role="img"` and `aria-label` to canvas elements.
