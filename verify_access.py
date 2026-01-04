from playwright.sync_api import sync_playwright

def verify_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        url = "http://localhost:5173"
        print(f"Navigating to {url}")
        try:
            page.goto(url)
            page.wait_for_selector("text=B2Buddy", timeout=5000)
        except Exception as e:
            print(f"Error loading page: {e}")
            return

        print("\n--- INPUTS WITH ARIA-LABEL ---")
        inputs = page.locator("input[aria-label]")
        count = inputs.count()
        print(f"Found {count} inputs with aria-label")
        for i in range(count):
            print(f"Input {i}: {inputs.nth(i).get_attribute('aria-label')}")

        print("\n--- BUTTONS WITH ARIA-LABEL ---")
        buttons = page.locator("button[aria-label]")
        count = buttons.count()
        print(f"Found {count} buttons with aria-label")
        for i in range(count):
            print(f"Button {i}: {buttons.nth(i).get_attribute('aria-label')}")

        browser.close()

if __name__ == "__main__":
    verify_accessibility()
