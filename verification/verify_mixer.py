from playwright.sync_api import sync_playwright

def verify_mixer_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (assuming standard Vite port 5173)
        page.goto("http://localhost:5173")

        # Wait a bit for React to hydrate
        page.wait_for_timeout(2000)

        # There are two Mixers rendered in the DOM!
        # One for desktop view (visible), one for mobile (hidden or visible depending on viewport)
        # Based on App.tsx, they are conditionally rendered via CSS classes (hidden md:block / md:hidden)
        # So both exist in the DOM.

        # We should target the visible one.
        # Since headless defaults to 1280x720 usually, the desktop one should be visible.

        # Check if the EQ knobs have the correct aria-labels
        # We use .first to pick the first one found, assuming the first one corresponds to the desktop/main view or just verifying existence.
        # Or better, filter by visibility.

        deck_a_high = page.get_by_label("DECK A AUDIO HIGH", exact=True).filter(has_text="").first
        deck_a_high.wait_for(timeout=10000)

        print("Found Deck A Audio High EQ")

        deck_a_high.focus()
        page.screenshot(path="verification/mixer_focus_a.png")

        # Check Video Channel Label
        deck_a_video_chroma = page.get_by_label("DECK A VIDEO CHROMA", exact=True).first
        deck_a_video_chroma.wait_for()
        print("Found Deck A Video Chroma")

        deck_a_video_chroma.focus()
        page.screenshot(path="verification/mixer_focus_b.png")

        # Check Volume/Opacity
        page.get_by_label("DECK A AUDIO Volume", exact=True).first.wait_for()
        page.get_by_label("DECK A VIDEO Opacity", exact=True).first.wait_for()
        print("Found Volume and Opacity controls")

        # Check Crossfader
        page.get_by_label("Crossfader").first.wait_for()
        print("Found Crossfader")

        browser.close()

if __name__ == "__main__":
    verify_mixer_accessibility()
