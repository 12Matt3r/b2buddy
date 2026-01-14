## 2024-05-23 - Accessibility in Complex Custom Controls

**Learning:** Complex interactive components like DJ decks often use generic HTML elements (divs, spans) or icon-only buttons for rich interactions. These completely lack semantic meaning for screen readers, making the app unusable for visually impaired users despite looking "intuitive" visually. Specifically, `range` inputs for pitch/volume often rely on visual proximity to text labels rather than programmatic association.

**Action:** Always use `useId` to generate unique IDs for labelling custom inputs (especially when mapped/reused like in Deck A/B). Ensure icon-only buttons have dynamic `aria-label`s that reflect their current state (e.g., "Play" vs "Pause").
