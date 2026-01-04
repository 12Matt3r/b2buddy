from playwright.sync_api import sync_playwright

def verify_mixer_render():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to local server
            page.goto("http://localhost:5173/")

            # Wait for mixer to be visible
            page.wait_for_selector("text=MASTER")

            # Move crossfader
            # Find the crossfader input
            crossfader = page.locator("input[type='range']").nth(4) # Assuming it's the 5th input (4 channels * 3 eqs + 4 vols... wait. Mixer has a lot of inputs.)

            # Let's count inputs.
            # 4 channels:
            #   3 EQ (high, mid, low)
            #   1 Volume
            # Total 16 inputs for channels.
            # Then crossfader is the 17th.

            # Better to find by surrounding text.
            # The crossfader is near "CROSSFADER" text.

            # Wait for the page to settle
            page.wait_for_timeout(2000)

            # Take screenshot of the Mixer area
            # We can find the mixer container. It has class "bg-gray-800 p-4 rounded-xl"
            # It's inside the main studio view.

            mixer_element = page.locator(".bg-gray-800.p-4.rounded-xl.border.border-gray-700.w-full.max-w-2xl").first

            if mixer_element.is_visible():
                mixer_element.screenshot(path="verification/mixer_optimized.png")
                print("Screenshot taken: verification/mixer_optimized.png")
            else:
                print("Mixer element not found")
                page.screenshot(path="verification/full_page_error.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_mixer_render()
