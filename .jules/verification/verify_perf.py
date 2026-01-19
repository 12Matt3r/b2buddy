from playwright.sync_api import sync_playwright

def verify_performance(page):
    # Navigate to the app (using preview port 4173)
    page.goto('http://localhost:4173')

    # Wait for the app to load
    page.wait_for_selector('h1:has-text("B2Buddy")')

    # Target the crossfader specifically in the visible Studio view.
    # The studio view container has className containing "block" when active, "hidden" otherwise.
    # But Playwright sees all in DOM.

    # We can use .first if we just want *any* crossfader interaction to prove the app didn't crash.
    # But strictly speaking, we want the visible one.

    crossfaders = page.locator('input[type="range"][min="-1"]')

    # Iterate to find the visible one
    count = crossfaders.count()
    print(f"Found {count} crossfaders")

    visible_crossfader = None
    for i in range(count):
        cf = crossfaders.nth(i)
        if cf.is_visible():
            visible_crossfader = cf
            break

    if visible_crossfader:
        visible_crossfader.fill('0.5')
    else:
        print("No visible crossfader found, using first")
        crossfaders.first.fill('0.5')

    # Take screenshot
    page.screenshot(path='.jules/verification/performance_verification.png')

    print("Verification complete. Screenshot saved.")

if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_performance(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
