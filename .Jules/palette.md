## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons are a common pattern for dense interfaces like DJ tools, but they create a significant barrier for screen reader users and new users if not properly labeled.
**Action:** When using icon-only buttons for navigation, always wrap them in a semantic `role="tablist"` container and apply `role="tab"`, `aria-selected`, `aria-label`, and `title` attributes. The `title` attribute provides a native tooltip for mouse users, while `aria-label` serves screen readers.

## 2024-05-24 - Semantic Association in Dense Controls
**Learning:** In a dense UI like a DJ Deck, `input[type="range"]` elements often rely on proximity for labeling ("PITCH" text next to slider). This fails WCAG criteria. Using `useId` to generate unique IDs and explicitly linking them with `htmlFor` is essential, especially when components are reused (multiple decks).
**Action:** For reused components with form inputs, always generate unique IDs with `useId` and link labels explicitly. Add `focus-visible` rings to custom inputs (`appearance-none`) to ensure keyboard navigability is visible.
