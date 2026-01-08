## 2024-05-23 - Library Navigation Accessibility
**Learning:** Icon-only buttons in complex navigation components (like the Library) create significant barriers for screen reader users if not explicitly labeled. The "Tab" pattern used here relied entirely on visual iconography.
**Action:** Always include `aria-label` for icon-only buttons, and consider `title` for tooltips to aid sighted users who might not recognize the icon. When possible, keep text labels visible or use standard accessible tab patterns.
