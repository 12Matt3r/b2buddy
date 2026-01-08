# Bolt's Journal

## 2024-05-22 - Missing useMemo in Library
**Learning:** `Library.tsx` performs case-insensitive filtering of tracks on every render.
**Action:** Use `useMemo` to cache filtered tracks.
