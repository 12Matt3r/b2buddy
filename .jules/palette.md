## 2026-01-27 - Dynamic Labels for Duplicated Components
**Learning:** When components like DJ Decks are duplicated (Deck A/B) and contain identical controls (Play/Pause), static ARIA labels ("Play") are insufficient for screen reader users to distinguish which deck they are controlling.
**Action:** Always include the unique component ID or context in the `aria-label` (e.g., "Play Deck 1") to provide unambiguous control descriptions.
