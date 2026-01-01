## 2024-05-23 - Icon-Only Navigation Buttons
**Learning:** The main navigation in `Library.tsx` relied entirely on icons without ARIA labels or role attributes. This made the navigation completely inaccessible to screen readers, who would only hear "button" for each tab.
**Action:** When using icon-only buttons for critical navigation, always wrap them in a container with `role="tablist"` and apply `role="tab"`, `aria-label`, and `aria-selected` attributes to the buttons.
