import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the local server URL
        page.goto('http://localhost:8000/courses/live-workshops.html')

        # Wait for the page to load
        page.wait_for_timeout(2000)

        # Verify the main heading is visible
        expect(page.get_by_role("heading", name="Live Workshops")).to_be_visible()

        # Take a screenshot for visual confirmation
        page.screenshot(path="jules-scratch/verification/live-workshops-fixed.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run_verification()