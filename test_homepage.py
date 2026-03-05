from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    # Navigate to the homepage
    page.goto("http://localhost:5174/")

    # Wait for the page to fully load
    page.wait_for_load_state("networkidle")

    # Take a screenshot to inspect the page
    page.screenshot(path="homepage_screenshot.png", full_page=True)

    # Get the page content
    content = page.content()

    # Check for any errors in console
    errors = []
    page.on("pageerror", lambda err: errors.append(err))

    # Wait a bit to see the page
    time.sleep(3)

    # Print any console errors
    if errors:
        print("Console errors found:")
        for err in errors:
            print(f"  - {err}")
    else:
        print("No console errors found.")

    # Check if main sections are visible
    try:
        # Check for banner section
        banner = page.locator(".banner-section")
        if banner.is_visible():
            print("✓ Banner section is visible")
        else:
            print("✗ Banner section is NOT visible")
    except:
        print("✗ Banner section not found")

    try:
        # Check for service section
        service = page.locator(".service-section")
        if service.is_visible():
            print("✓ Service section is visible")
        else:
            print("✗ Service section is NOT visible")
    except:
        print("✗ Service section not found")

    try:
        # Check for solution section
        solution = page.locator(".solution-section")
        if solution.is_visible():
            print("✓ Solution section is visible")
        else:
            print("✗ Solution section is NOT visible")
    except:
        print("✗ Solution section not found")

    try:
        # Check for product section
        product = page.locator(".product-section")
        if product.is_visible():
            print("✓ Product section is visible")
        else:
            print("✗ Product section is NOT visible")
    except:
        print("✗ Product section not found")

    try:
        # Check for partner section
        partner = page.locator(".partner-section")
        if partner.is_visible():
            print("✓ Partner section is visible")
        else:
            print("✗ Partner section is NOT visible")
    except:
        print("✗ Partner section not found")

    # Get page title
    print(f"\nPage title: {page.title()}")

    # Keep browser open for a few more seconds
    time.sleep(2)

    browser.close()

    print("\nScreenshot saved as 'homepage_screenshot.png'")
