from playwright.sync_api import sync_playwright

def verify_library_rendering():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (assuming it's running on port 5173)
        page.goto("http://localhost:5173")

        # Wait for the app to load
        page.wait_for_selector("text=B2Buddy")

        # The Library component should be visible.
        # Check if tracks are rendered.
        # We look for "Acid Rain" which is one of the mock tracks.
        page.wait_for_selector("text=Acid Rain")

        # Take a screenshot of the library
        page.screenshot(path="verification/library_optimized.png")

        print("Screenshot taken: verification/library_optimized.png")

        browser.close()

if __name__ == "__main__":
    verify_library_rendering()
