
import time
from playwright.sync_api import sync_playwright

def verify_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:4173")

        # Wait for the app to load
        page.wait_for_timeout(2000)

        print("Checking Mixer ARIA labels...")

        # Check EQ knobs
        eq_labels = [
            "DECK A VIDEO CHROMA", "DECK A VIDEO LUMA", "DECK A VIDEO OPAC",
            "DECK A AUDIO HIGH", "DECK A AUDIO MID", "DECK A AUDIO LOW",
            "DECK B VIDEO CHROMA", "DECK B VIDEO LUMA", "DECK B VIDEO OPAC",
            "DECK B AUDIO HIGH", "DECK B AUDIO MID", "DECK B AUDIO LOW"
        ]

        for label in eq_labels:
            element = page.get_by_label(label)
            if element.count() > 0:
                print(f"✅ Found input with aria-label: '{label}'")
            else:
                print(f"❌ Missing input with aria-label: '{label}'")

        # Check Volume/Opacity faders
        fader_labels = [
            "DECK A AUDIO Volume", "DECK A VIDEO Opacity",
            "DECK B AUDIO Volume", "DECK B VIDEO Opacity"
        ]

        for label in fader_labels:
            element = page.get_by_label(label)
            if element.count() > 0:
                print(f"✅ Found fader with aria-label: '{label}'")
            else:
                print(f"❌ Missing fader with aria-label: '{label}'")

        # Check Crossfader
        if page.get_by_label("Crossfader").count() > 0:
            print("✅ Found Crossfader with aria-label: 'Crossfader'")
        else:
            print("❌ Missing Crossfader")

        print("\nChecking DJDeck ARIA labels...")

        # Check Play/Pause buttons (assuming Deck 1 and 2 exist)
        if page.get_by_label("Play Deck 1").count() > 0:
            print("✅ Found Play button for Deck 1")
        else:
             print("❌ Missing Play button for Deck 1")

        if page.get_by_label("Play Deck 2").count() > 0:
            print("✅ Found Play button for Deck 2")
        else:
             print("❌ Missing Play button for Deck 2")

        # Check Pitch label association
        # We look for inputs labeled "PITCH" (case insensitive usually via label text, but here we used visible label text)
        pitch_inputs = page.get_by_label("PITCH")
        count = pitch_inputs.count()
        if count >= 2:
             print(f"✅ Found {count} inputs associated with 'PITCH' label")
        else:
             print(f"❌ Found only {count} inputs associated with 'PITCH' label")

        # Take a screenshot for visual confirmation
        page.screenshot(path="verification_accessibility.png")
        print("\nScreenshot saved to verification_accessibility.png")

        browser.close()

if __name__ == "__main__":
    verify_accessibility()
