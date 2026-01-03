## 2024-05-24 - Accessible Mixer & Deck Controls
**Learning:** Complex controls like multi-channel mixers are completely opaque to screen readers without explicit ARIA labels. Loop-generated inputs often miss unique labels.
**Action:** When mapping over channels/bands, always construct a dynamic `aria-label` that includes the full context (e.g., "Deck A Video Chroma EQ") rather than just the visual label ("High").
