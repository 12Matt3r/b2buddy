## 2024-05-24 - Accessibility in Density-Heavy Interfaces
**Learning:** In complex control panels like mixers, inputs are often stripped of default styling (`appearance-none`) to fit custom designs. This inadvertantly removes default focus rings, making keyboard navigation impossible.
**Action:** When using `appearance-none`, always explicitly re-add focus states (e.g. `focus:ring-2`) and ensure invisible inputs have descriptive `aria-label`s constructed from their context (Deck/Type/Param).
