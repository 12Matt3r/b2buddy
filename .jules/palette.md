## 2024-05-23 - Dynamic ARIA Labels in Complex Components
**Learning:** Complex components like Audio/Video mixers often reuse UI elements (sliders) for different purposes (EQ vs Opacity). Static `aria-label`s are insufficient. Using dynamic labels derived from props (e.g., `${deckLabel} ${typeLabel} ${band}`) provides necessary context without cluttering the UI.
**Action:** When componentizing complex controls, always ensure the parent passes enough context to generate unique, descriptive `aria-label`s for every input.
