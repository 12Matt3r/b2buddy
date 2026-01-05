
from playwright.sync_api import sync_playwright, expect

def verify_library_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the app
            page.goto("http://localhost:5173")

            # Wait for content to load
            page.wait_for_selector("div[role='tablist']")

            # 1. Verify Tablist
            tablist = page.locator("div[role='tablist']")
            expect(tablist).to_be_visible()
            expect(tablist).to_have_attribute("aria-label", "Library Sections")
            print("✅ Tablist found with correct aria-label")

            # 2. Verify Tabs
            tracks_tab = page.locator("button[role='tab'][aria-label='Tracks']")
            expect(tracks_tab).to_be_visible()
            expect(tracks_tab).to_have_attribute("aria-selected", "true") # Default selected
            print("✅ Tracks tab found with correct role and aria-label")

            playlists_tab = page.locator("button[role='tab'][aria-label='Playlists']")
            expect(playlists_tab).to_be_visible()
            expect(playlists_tab).to_have_attribute("aria-selected", "false")
            print("✅ Playlists tab found")

            # 3. Verify Search Input
            search_input = page.locator("input[aria-label='Search tracks']")
            expect(search_input).to_be_visible()
            print("✅ Search input found with aria-label")

            # 4. Verify Track Item Buttons
            # We need to hover over a track to reveal some buttons, but aria-labels should be present in DOM
            # The Load A/B buttons are opacity-0 until hover, but they exist.
            # Let's check the first track's buttons.

            # Find the first track container
            # The structure is somewhat deeply nested, let's look for the buttons directly by label

            # Note: The mock data has a track named "Acid Rain"
            acid_rain_load_a = page.locator("button[aria-label='Load Acid Rain to Deck A']")
            expect(acid_rain_load_a).to_have_count(1)
            print("✅ Load A button found for 'Acid Rain'")

            acid_rain_add_queue = page.locator("button[aria-label='Add Acid Rain to VJ Queue']")
            expect(acid_rain_add_queue).to_have_count(1)
            print("✅ Add to Queue button found for 'Acid Rain'")

            # Take a screenshot just to satisfy the requirement, though visual change is minimal
            page.screenshot(path="verification/library_a11y.png")
            print("📸 Screenshot taken")

        except Exception as e:
            print(f"❌ Verification failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_library_accessibility()
