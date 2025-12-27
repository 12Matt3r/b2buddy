## 2024-05-23 - Library Accessibility Gaps
**Learning:** Icon-only navigation in dense UIs (like the Library tabs) creates a "blind spot" for screen readers if not explicitly labeled, rendering major app sections inaccessible. Adding `role="tablist"` and `aria-label` provides necessary context that visual cues (icons) take for granted.
**Action:** Always verify icon-only tabs have `aria-label` and `role` attributes during the implementation phase, not just as a retrofit.
