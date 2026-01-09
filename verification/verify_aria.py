from playwright.sync_api import sync_playwright

def verify_dj_deck_aria_labels():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:4173")
        page.wait_for_selector("text=Deck 1")

        # We might have duplicates due to responsive layout (mobile/desktop hidden/shown)
        # So we check if AT LEAST ONE valid one exists.

        # Check Play/Pause Button ARIA label
        play_btns = page.locator("button[aria-label='Play Deck 1']")
        count = play_btns.count()
        print(f"Found {count} Play/Pause buttons for Deck 1")
        if count > 0:
            print("SUCCESS: Found button with aria-label='Play Deck 1'")

        # Check Pitch Slider ARIA label
        pitch_inputs = page.locator("input[aria-label='Pitch control for Deck 1']")
        count = pitch_inputs.count()
        print(f"Found {count} Pitch inputs for Deck 1")
        if count > 0:
            print("SUCCESS: Found pitch input with aria-label='Pitch control for Deck 1'")

        # Check Canvas Role and ARIA label
        canvases = page.locator("canvas[aria-label='Audio waveform visualization for Deck 1']")
        count = canvases.count()
        print(f"Found {count} Canvases for Deck 1")

        if count > 0:
            # Check the first one
            first_canvas = canvases.first
            role = first_canvas.get_attribute("role")
            if role == "img":
                print("SUCCESS: Canvas has role='img'")
            else:
                print(f"FAILURE: Canvas has role='{role}' instead of 'img'")

        page.screenshot(path="verification/dj_deck_aria.png")
        browser.close()

if __name__ == "__main__":
    verify_dj_deck_aria_labels()
