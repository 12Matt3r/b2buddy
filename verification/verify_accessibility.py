from playwright.sync_api import sync_playwright

def verify_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # We need to serve the app first, but for now we can just check the compiled output if we serve it,
        # OR we can assume the dev server is running.
        # Since I can't easily start a long-running server in this environment without blocking,
        # I will try to use the dev server if it's running, or build and serve.

        # Actually, the most reliable way in this sandbox is to check the file content or run a unit test.
        # But instructions say use Playwright.
        # I will assume the user has a dev server running or I can start one in background.
        # Let's try to start a preview server in background.

        print("Starting browser...")
        page.goto("http://localhost:4173") # Standard Vite preview port

        # Wait for library to load
        # MobileNav also has "Library" text but it might be hidden on desktop view.
        # Let's wait for something that is definitely in the Desktop Library component.
        # The tabs themselves have icons, but we just added aria-labels.
        # Let's wait for one of the aria-labels to appear.
        print("Waiting for Tracks tab...")
        page.wait_for_selector("button[aria-label='Tracks']", timeout=10000)

        # Check for Aria Labels on Tabs
        print("Checking Tab Aria Labels...")
        tracks_tab = page.locator("button[aria-label='Tracks']")
        assert tracks_tab.count() > 0, "Tracks tab missing aria-label"

        playlists_tab = page.locator("button[aria-label='Playlists']")
        assert playlists_tab.count() > 0, "Playlists tab missing aria-label"

        # Check Search Input
        print("Checking Search Input Aria Label...")
        search_input = page.locator("input[aria-label='Search library']")
        assert search_input.count() > 0, "Search input missing aria-label"

        print("Accessibility verification passed!")

        page.screenshot(path="verification/accessibility_check.png")
        browser.close()

if __name__ == "__main__":
    verify_accessibility()
