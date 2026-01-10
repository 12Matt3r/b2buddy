## 2024-05-23 - Missing Accessibility Labels on Custom Controls
**Learning:** This app relies heavily on custom `<input type="range">` elements for audio/visual controls (Pitch, EQ, Volume) that lack `aria-label` or `id` associations, making them invisible to screen readers despite having visual labels.
**Action:** When touching any control component (`Mixer`, `DJDeck`), systematically enforce `aria-label` or `aria-labelledby` for all range inputs.
