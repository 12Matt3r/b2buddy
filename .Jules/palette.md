# Palette's Journal

## 2024-05-22 - Initial Entry
**Learning:** This journal tracks critical UX/a11y learnings.
**Action:** Use this file to record patterns and insights for future reference.

## 2024-05-22 - Dynamic Inputs Accessibility
**Learning:** In complex interfaces like mixers, dynamic inputs (sliders/knobs) often lack context when visually grouped. Screen readers need explicit labels that include the full context (Deck, Type, Control) which isn't immediately adjacent in the DOM.
**Action:** Always construct dynamic `aria-label`s for inputs generated in loops or reusable functions, ensuring they fully describe the control's purpose within its specific context (e.g., "Deck A Video Opacity" instead of just "Opacity").
