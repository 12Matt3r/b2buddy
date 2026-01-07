## 2026-01-07 - Missing Accessibility Attributes on Interactive Elements
**Learning:** A recurring pattern in the codebase is the use of icon-only buttons (using `lucide-react`) and range inputs without `aria-label` or `aria-labelledby` attributes. This makes core controls like Play/Pause and Pitch sliders inaccessible to screen reader users.
**Action:** When creating or refactoring controls:
1.  Always add `aria-label` to icon-only buttons (e.g., `aria-label="Play Deck 1"`).
2.  Add `aria-hidden="true"` to the decorative icon inside the button to prevent redundant announcements.
3.  Ensure range inputs (sliders) have an `aria-label` describing their function (e.g., `aria-label="Pitch control"`).
4.  For visualizer canvases, explicit `role="img"` and `aria-label` are needed to explain their purpose.
