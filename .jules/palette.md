## 2024-05-24 - Accessible Tab Navigation Pattern
**Learning:** Icon-only tab buttons are a common pattern in tight UIs (like sidebars), but they render completely invisible to screen readers without explicit labelling.
**Action:** Always wrap icon-only tabs in a container with `role="tablist"` and give each button `role="tab"`, `aria-selected`, and a descriptive `aria-label`. This transforms a "div soup" of buttons into a semantic, navigable structure.
