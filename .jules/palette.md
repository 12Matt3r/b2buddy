## 2024-10-24 - Dynamic Labels for Toggle Buttons
**Learning:** Toggle buttons (like Play/Pause) that change icon/state must also update their `aria-label` to reflect the *current* action (e.g., "Pause Deck 1" vs "Play Deck 1") rather than a generic or static label.
**Action:** Always implement conditional logic for `aria-label` on toggle buttons to ensure screen reader users know exactly what will happen when they activate the control.
