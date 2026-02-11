from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173")

        # Wait for the app to load
        page.wait_for_selector("text=Studio", timeout=10000)

        # Check Deck 1 Play Button aria-label (initial)
        play_btn_1 = page.locator("button[aria-label='Play Deck 1'] >> visible=true")
        expect(play_btn_1).to_be_visible()
        expect(play_btn_1).to_have_attribute("aria-label", "Play Deck 1")
        print("✅ Deck 1 Play button found with correct aria-label")

        # Check Deck 1 Play button is disabled (no track loaded)
        expect(play_btn_1).to_be_disabled()
        print("✅ Deck 1 Play button is disabled (no track loaded)")

        # Use YouTube import to load a track (easier than file upload or missing samples)
        # 1. Click YouTube tab
        # Tabs are buttons with role="tab". The one for YouTube has aria-label="YouTube"
        yt_tab = page.locator("button[role='tab'][aria-label='YouTube']")
        yt_tab.click()
        print("Clicked YouTube tab")

        # 2. Type in input
        yt_input = page.locator("input[placeholder='Paste YouTube Link...']")
        yt_input.fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ")

        # 3. Click Import button
        # It's a button next to input. It has a Plus icon.
        # We can find it by the click handler or just being the button in that container.
        # It has class "bg-red-600".
        import_btn = page.locator("div.p-4 button.bg-red-600")
        import_btn.click()
        print("Clicked Import button")

        # 4. Wait for processing (simulated 1s)
        page.wait_for_timeout(1500)

        # 5. Should be back to tracks tab automatically (code says setActiveTab('tracks'))
        # Find the new track. It starts with "YouTube Video".
        # Find the "Load A" button for it.
        # We look for a container having the text "YouTube Video" and then find the "Load A" button inside it?
        # Or just the first "Load A" button that corresponds to a youtube track?
        # The new track is added to the end of the list.

        # Let's find the last "Load A" button.
        # Or find by text "YouTube Video".

        # Locator for the track title
        yt_track_title = page.locator("div", has_text="YouTube Video").last
        # We need the parent row to find the button.
        # The row has class "group".
        # Let's traverse up or use a filter.

        # Better: use the button directly.
        # The new track is at the bottom.
        load_btn = page.locator("button:has-text('Load A')").last
        load_btn.click()
        print("Clicked Load A for YouTube track")

        # 6. Now Play button should be enabled
        expect(play_btn_1).to_be_enabled()
        print("✅ Deck 1 Play button is enabled")

        # 7. Click Play
        play_btn_1.click()
        print("Clicked Play")

        # 8. Verify aria-label changed to "Pause Deck 1"
        pause_btn_1 = page.locator("button[aria-label='Pause Deck 1'] >> visible=true")
        expect(pause_btn_1).to_be_visible()
        print("✅ Deck 1 Play button changed to Pause button with correct aria-label")

        # Take a screenshot
        page.screenshot(path="verification/djdeck_a11y.png")
        print("📸 Screenshot taken")

        browser.close()

if __name__ == "__main__":
    run()
