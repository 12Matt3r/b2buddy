## 2024-05-24 - Dynamic ARIA Labels in Complex Mixers
**Learning:** Complex interfaces like DJ mixers reuse identical visual components (sliders) across multiple channels. Without context in `aria-label`, screen reader users cannot distinguish between "Deck A Volume" and "Deck B Opacity".
**Action:** Use dynamic string construction for `aria-label` (e.g., `${deck} ${type} ${function}`) to ensure every input has a unique, descriptive accessible name without visual clutter.
