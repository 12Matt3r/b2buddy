# Palette's UX Journal

## 2024-10-27 - Hidden Primary Actions
**Learning:** The application relies on `opacity-0` hover states for primary actions (Load Track), which hinders keyboard accessibility and mobile discovery.
**Action:** Use `group-focus-within` to reveal controls on keyboard navigation and ensure ARIA labels provide context for icon-only or generic buttons.
