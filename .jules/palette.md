## 2024-05-22 - Labelling Custom Controls
**Learning:** Custom interactive elements like waveform canvases and unlabelled range inputs (sliders) are invisible to screen readers without explicit `role` and `aria-label` attributes.
**Action:** Always verify `canvas` elements used for visualization have `role="img"` and a descriptive `aria-label`. Ensure all `input[type="range"]` have an associated label or `aria-label`.
