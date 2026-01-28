from playwright.sync_api import sync_playwright, expect
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Use 4173 for preview
    url = "http://localhost:4173"
    print(f"Navigating to {url}")
    page.goto(url)

    # Wait for app to load
    page.wait_for_selector("text=B2Buddy", timeout=10000)

    # 1. Verify Library renders and Tabs work
    print("Verifying Library...")

    # Check Library exists
    expect(page.get_by_label("Library Navigation")).to_be_visible()

    # Click Playlists tab
    page.get_by_role("tab", name="Playlists").click()
    expect(page.get_by_text("Warmup Set")).to_be_visible()

    # Click Tracks tab back
    page.get_by_role("tab", name="Tracks").click()
    expect(page.get_by_text("Import Media")).to_be_visible()

    # 2. Verify DrumRack renders
    print("Verifying DrumRack...")
    expect(page.get_by_text("Drum Rack (AV)")).to_be_visible()

    # 4. Verify View Switching (Battle Arena)
    print("Verifying Battle Arena...")
    # There are multiple "Battle" buttons.
    page.get_by_role("button", name="Battle").filter(has_text="Battle").first.click()

    # BattleArena should be visible. Filter by visible=True to avoid strict mode error on hidden mobile instance.
    expect(page.get_by_text("AI Battle Arena").filter(visible=True)).to_be_visible()
    expect(page.get_by_text("START BATTLE").filter(visible=True)).to_be_visible()

    # 5. Take Screenshot
    print("Taking screenshot...")
    os.makedirs("verification", exist_ok=True)
    screenshot_path = "verification/frontend_verified.png"
    page.screenshot(path=screenshot_path)

    browser.close()
    print(f"Verification complete. Screenshot saved to {screenshot_path}")

with sync_playwright() as playwright:
    run(playwright)
