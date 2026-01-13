## 2024-05-23 - [Accessibility] Custom Slider Labelling
**Learning:** Custom range inputs (like the Pitch slider) often use non-standard text elements as visual labels. Standard `<label>` association can be tricky if the layout is complex.
**Action:** Use `aria-labelledby` pointing to the ID of the visual label element (e.g., the `span`) to programmatically associate the description with the input, ensuring screen readers announce it correctly without duplicating text in an `aria-label`.
