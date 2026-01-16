## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons are a common pattern for dense interfaces like DJ tools, but they create a significant barrier for screen reader users and new users if not properly labeled.
**Action:** When using icon-only buttons for navigation, always wrap them in a semantic `role="tablist"` container and apply `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes. The `title` attribute provides a native tooltip for mouse users, while `aria-label` serves screen readers.

## 2024-05-24 - Accessibility in Reusable Components
**Learning:** When reusing components like `DJDeck` that contain form inputs (like sliders), standard `id` attributes cause duplicates in the DOM, breaking accessibility associations (labels pointing to the wrong input).
**Action:** Use React's `useId` hook to generate unique IDs for inputs within reusable components to ensure `label` elements are correctly associated with their corresponding inputs via `htmlFor`.
