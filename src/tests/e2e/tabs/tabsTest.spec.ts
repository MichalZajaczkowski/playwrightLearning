import {test, expect} from "@playwright/test";
import {GlobalsQaPage} from "../../../pages/globalQa/globalsQaPage";
import {resizeElement, resizeElementByDrag, verifyElementSize} from "../../../utils/helpers";

// // Global beforeEach hook
// test.beforeEach(async ({page}) => {
//     const consentButton = page.locator("button.fc-cta-consent");
//     if (await consentButton.isVisible({timeout: 2000}).catch(() => false)) {
//         console.log("Klikam w 'Consent' w beforeEach");
//         await consentButton.click();
//     }
// });

// 2) Describe nr 1 - w nim mamy DODATKOWO otwieranie strony
test.describe("Accordion And Tabs - scenario with openHomePage", () => {
    let globalQaPage: GlobalsQaPage;

    test.beforeEach(async ({page}) => {
        // Tutaj otwieramy stronę
        globalQaPage = new GlobalsQaPage(page);
        await globalQaPage.openHomePage();
        const consentButton = page.locator("button.fc-cta-consent");
        if (await consentButton.isVisible({timeout: 2000}).catch(() => false)) {
            console.log("Klikam w 'Consent' w beforeEach");
            await consentButton.click();
        }
    });


    test("should open tabs page", async ({page}) => {
        // Sprawdzamy widoczność przycisku "Tabs"
        const isVisible = await globalQaPage.isTabsButtonVisible();
        expect(isVisible).toBe(true);

        // Klikamy "Tabs"
        await globalQaPage.clickTabsButton();

        // Czekamy na docelową stronę
        await page.waitForLoadState("networkidle");
        expect(page.url()).toContain("accordion-and-tabs");

        const checkPageTitle = await page.locator("h1").textContent();
        expect(checkPageTitle).toContain("Accordion And Tabs");
    });
});

// 3) Describe nr 2 - test bez otwierania strony (ale cookies wciąż obsłużone w globalnym beforeEach)
test.describe("Accordion And Tabs - Simple Accordion", () => {
    let globalQaPage: GlobalsQaPage;

    test.beforeEach(async ({page}) => {
        // Tutaj otwieramy stronę
        globalQaPage = new GlobalsQaPage(page);
        await globalQaPage.openAccordionAndTabsPage();
        const consentButton = page.locator("button.fc-cta-consent");
        if (await consentButton.isVisible({timeout: 2000}).catch(() => false)) {
            console.log("Klikam w 'Consent' w beforeEach");
            await consentButton.click();
        }
    });

    test("should check if the first accordion is unfolded", async ({page}) => {
        await page.waitForLoadState("networkidle");

        // 2. Wait for the iframe to load
        const iframe = page.frameLocator('iframe[data-src*="accordion/collapsible.html"]');
        await iframe.locator('#accordion').waitFor();

        // 3. Use a specific selector to target the first accordion header/trigger element within the iframe
        const firstAccordionHeader = iframe.locator('#accordion h3:first-child');

        // 4. Check if the first accordion is unfolded (active)
        await expect(firstAccordionHeader).toHaveClass(/ui-state-active/);

        // 5. Check if the corresponding content div is visible
        const firstAccordionContent = iframe.locator('#accordion div:first-of-type');
        await expect(firstAccordionContent).toBeVisible();
    });
    test("should check accordions and contents", async ({page}) => {
        await page.waitForLoadState("networkidle");

        const iframe = page.frameLocator('iframe[data-src*="accordion/collapsible.html"]');
        await iframe.locator('#accordion').waitFor();

        const accordions = iframe.locator('#accordion h3');
        const contents = iframe.locator('#accordion div');

        // check if the first accordion is selected
        await expect(accordions.nth(0)).toHaveClass(/ui-state-active/);

        // expand the third accordion check if it is selected
        await accordions.nth(2).click();
        await expect(accordions.nth(2)).toHaveClass(/ui-state-active/);

        // check if the first accordion is unselected
        await expect(accordions.nth(0)).not.toHaveClass(/ui-state-active/);

        // expand the remaining accordions one by one
        for (let i = 0; i < 4; i++) {
            await accordions.nth(i).click();
            await expect(accordions.nth(i)).toHaveClass(/ui-state-active/);
            await expect(contents.nth(i)).toBeVisible();
        }
    });

    test("should check accordion text content and behavior", async ({page}) => {
        await page.waitForLoadState("networkidle");

        const iframe = page.frameLocator('iframe[data-src*="accordion/collapsible.html"]');
        await iframe.locator('#accordion').waitFor();

        const accordions = iframe.locator('#accordion h3');
        const firstAccordionContent = iframe.locator('#accordion div:nth-child(2)');
        const secondAccordionContent = iframe.locator('#accordion div:nth-child(4)');

        // Check if the text in the first accordion starts and ends with the correct phrases
        const firstAccordionText = await firstAccordionContent.locator('p').textContent();
        expect(firstAccordionText).toMatch(new RegExp("^Mauris mauris ante.*vulputate.$"));

        // Check if the first accordion is initially active
        await expect(accordions.nth(0)).toHaveClass(/ui-state-active/);

        // Open second accordion
        await accordions.nth(1).click();

        // Wait for the first accordion to completely fold
        await iframe.locator('#accordion div:nth-child(2)').waitFor({state: 'hidden'});

        // Check if the second accordion is now active
        await expect(accordions.nth(1)).toHaveClass(/ui-state-active/);

        // Check if the first accordion is now inactive
        await expect(accordions.nth(0)).not.toHaveClass(/ui-state-active/);

        // Check if the text in the second accordion contains the correct sequence
        const secondAccordionText = await secondAccordionContent.locator('p').textContent();
        expect(secondAccordionText).toContain("dolor at aliquet laoreet");
    });
});

test.describe("Accordion And Tabs - Re-Size Accordion", () => {
    let globalQaPage: GlobalsQaPage;

    test.beforeEach(async ({page}) => {
        // Tutaj otwieramy stronę
        globalQaPage = new GlobalsQaPage(page);
        await globalQaPage.openAccordionAndTabsPage();
        const consentButton = page.locator("button.fc-cta-consent");
        if (await consentButton.isVisible({timeout: 2000}).catch(() => false)) {
            console.log("Klikam w 'Consent' w beforeEach");
            await consentButton.click();
        }
    });

    test("should check if the first accordion is unfolded re-size accordion", async ({page}) => {
        await page.waitForLoadState("networkidle");

        await globalQaPage.reSizeAccordionClick();
        // 2. Wait for the iframe to load
        const iframe = page.frameLocator('iframe[data-src*="accordion/fillspace.html"]');
        await iframe.locator('#accordion').waitFor();

        // 3. Use a specific selector to target the first accordion header/trigger element within the iframe
        const firstAccordionHeader = iframe.locator('#accordion h3:first-child');

        // 4. Check if the first accordion is unfolded (active)
        await expect(firstAccordionHeader).toHaveClass(/ui-state-active/);

        // 5. Check if the corresponding content div is visible
        const firstAccordionContent = iframe.locator('#accordion div:first-of-type');
        await expect(firstAccordionContent).toBeVisible();
    });
    test("should Resize the outer container:check accordions and contents", async ({page}) => {

        await page.waitForLoadState("networkidle");
        await globalQaPage.reSizeAccordionClick();
        const iframe = page.frameLocator('iframe[data-src*="accordion/fillspace.html"]');
        await iframe.locator('#accordion').waitFor();

        const accordions = iframe.locator('#accordion h3');
        const contents = iframe.locator('#accordion div');

        // // Resize the container
        // await resizeElement(iframe, '#accordion', '400px', '280px');
        // // Verify the size of the container
        // await verifyElementSize(iframe, '#accordion', 400, 280);
        const initialAccordionSize = await iframe.locator('#accordion-resizer').boundingBox();
        const deltaX = 50; // Przeciągnij o 50 pikseli w prawo
        const deltaY = 30; // Przeciągnij o 30 pikseli w dół

        // Resize the container by dragging the resizer
        // Resize the container by dragging the resizer
        await resizeElementByDrag(page, iframe, '.ui-resizable-handle.ui-resizable-se', deltaX, deltaY);

        // Verify the size of the container
        await verifyElementSize(iframe, '#accordion-resizer', initialAccordionSize.width + deltaX, initialAccordionSize.height + deltaY);

        // check if the first accordion is selected
        await expect(accordions.nth(0)).toHaveClass(/ui-state-active/);

        // expand the third accordion check if it is selected
        await accordions.nth(2).click();
        await expect(accordions.nth(2)).toHaveClass(/ui-state-active/);

        // check if the first accordion is unselected
        await expect(accordions.nth(0)).not.toHaveClass(/ui-state-active/);

        // expand the remaining accordions one by one
        for (let i = 0; i < 4; i++) {
            await accordions.nth(i).click();
            await expect(accordions.nth(i)).toHaveClass(/ui-state-active/);
            await expect(contents.nth(i)).toBeVisible();
        }
    })
});

test.describe("Accordion And Tabs - Toggle Accordion", () => {
    let globalQaPage: GlobalsQaPage;

    test.beforeEach(async ({page}) => {
        // Tutaj otwieramy stronę
        globalQaPage = new GlobalsQaPage(page);
        await globalQaPage.openAccordionAndTabsPage();
        const consentButton = page.locator("button.fc-cta-consent");
        if (await consentButton.isVisible({timeout: 2000}).catch(() => false)) {
            console.log("Klikam w 'Consent' w beforeEach");
            await consentButton.click();
        }
    });
    test("should check whether accordion have toggle icon inside", async ({page}) => {
        await page.waitForLoadState("networkidle");
        await globalQaPage.toggleAccordionClick();

        // Zmiana selektora iframe na właściwy dla Toggle Icons
        const iframe = page.frameLocator('iframe[data-src*="custom-icons.html"]');
        await iframe.locator('#accordion').waitFor();

        // Poprawiony selektor dla ikon
        const toggleIcons = iframe.locator('.ui-accordion-header .ui-accordion-header-icon');

        // Sprawdź ikony dla każdego akordeonu
        for (let i = 0; i < 4; i++) {
            await expect(toggleIcons.nth(i)).toBeVisible();

            // Opcjonalnie: sprawdź czy ikony mają odpowiednie klasy
            //const header = iframe.locator('.ui-accordion-header').nth(i);
            if (i === 0) {
                await expect(toggleIcons.nth(i)).toHaveClass(/ui-icon-circle-arrow-s/);
            } else {
                await expect(toggleIcons.nth(i)).toHaveClass(/ui-icon-circle-arrow-e/);
            }
        }

        // Opcjonalnie: sprawdź działanie przycisku Toggle
        const toggleButton = iframe.locator('#toggle');
        await expect(toggleButton).toBeVisible();
    });
});
